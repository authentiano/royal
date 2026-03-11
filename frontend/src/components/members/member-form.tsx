"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { membersApi } from "@/lib/api"
import { Member } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface MemberFormProps {
  member?: Member | null
  onSuccess: () => void
  onCancel: () => void
}

export function MemberForm({ member, onSuccess, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState({
    first_name: member?.first_name || "",
    last_name: member?.last_name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    gender: member?.gender || "",
    date_of_birth: member?.date_of_birth || "",
    address: member?.address || "",
    is_active: member?.is_active ?? true,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => membersApi.create(data),
    onSuccess: onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      membersApi.update(id, data),
    onSuccess: onSuccess,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      date_of_birth: formData.date_of_birth || null,
      email: formData.email || null,
    }

    if (member) {
      updateMutation.mutate({ id: member.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) =>
              setFormData({ ...formData, gender: value })
            }
            options={[
              { value: "", label: "Select..." },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) =>
              setFormData({ ...formData, date_of_birth: e.target.value })
            }
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            disabled={isLoading}
            className="h-4 w-4"
          />
          Is Active
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : member ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
