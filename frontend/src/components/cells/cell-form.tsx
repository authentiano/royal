"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { cellsApi, membersApi } from "@/lib/api"
import { Cell, Member } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface CellFormProps {
  cell?: Cell | null
  onSuccess: () => void
  onCancel: () => void
}

const MEETING_DAYS = [
  { value: "", label: "Select day..." },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
]

const CELL_STATUSES = [
  { value: "", label: "Select status..." },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_hold", label: "On Hold" },
]

export function CellForm({ cell, onSuccess, onCancel }: CellFormProps) {
  const [formData, setFormData] = useState({
    name: cell?.name || "",
    description: cell?.description || "",
    meeting_day: cell?.meeting_day || "",
    meeting_time: cell?.meeting_time ? cell.meeting_time.slice(0, 5) : "",
    location: cell?.location || "",
    leader_id: cell?.leader || null,
    co_leader_id: cell?.co_leader || null,
    status: cell?.status || "active",
  })

  // Force re-render when cell changes
  useEffect(() => {
    if (cell) {
      setFormData({
        name: cell.name || "",
        description: cell.description || "",
        meeting_day: cell.meeting_day || "",
        meeting_time: cell.meeting_time ? cell.meeting_time.slice(0, 5) : "",
        location: cell.location || "",
        leader_id: cell.leader || null,
        co_leader_id: cell.co_leader || null,
        status: cell.status || "active",
      })
    }
  }, [cell])

  // Fetch members for leader/co-leader selection
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await membersApi.getAll()
      return response.data as Member[]
    },
  })

  const memberOptions = React.useMemo(() => {
    return members?.map((m: Member) => ({
      value: m.id.toString(),
      label: `${m.first_name} ${m.last_name}`,
    })) || []
  }, [members])

  const createMutation = useMutation({
    mutationFn: (data: any) => cellsApi.create(data),
    onSuccess: (response) => {
      console.log("Cell created:", response.data)
      onSuccess()
    },
    onError: (error: any) => {
      console.error("Failed to create cell:", error)
      console.error("Error details:", error.response?.data)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      cellsApi.update(id, data),
    onSuccess: (response) => {
      console.log("Cell updated:", response.data)
      onSuccess()
    },
    onError: (error: any) => {
      console.error("Failed to update cell:", error)
      console.error("Error details:", error.response?.data)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      name: formData.name,
      description: formData.description,
      meeting_day: formData.meeting_day || null,
      meeting_time: formData.meeting_time || null,
      location: formData.location || null,
      leader: formData.leader_id || null,
      co_leader: formData.co_leader_id || null,
      status: formData.status,
    }

    console.log("Submitting cell data:", submitData)

    if (cell) {
      updateMutation.mutate({ id: cell.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="name">Cell Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="e.g., Hope Cell, Faith Group"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of the cell's purpose or focus"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="meeting_day">Meeting Day</Label>
          <Select
            value={formData.meeting_day}
            onValueChange={(value) =>
              setFormData({ ...formData, meeting_day: value })
            }
            options={MEETING_DAYS}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting_time">Meeting Time</Label>
          <Input
            id="meeting_time"
            type="time"
            value={formData.meeting_time}
            onChange={(e) =>
              setFormData({ ...formData, meeting_time: e.target.value })
            }
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Meeting Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="e.g., Main Hall, Room 101, or member's home"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leader">Cell Leader</Label>
          <Select
            value={formData.leader_id?.toString() || ""}
            onValueChange={(value) =>
              setFormData({ 
                ...formData, 
                leader_id: value ? parseInt(value) : null 
              })
            }
            options={[
              { value: "", label: "No leader assigned" },
              ...memberOptions
            ]}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="co_leader">Co-Leader</Label>
          <Select
            value={formData.co_leader_id?.toString() || ""}
            onValueChange={(value) =>
              setFormData({ 
                ...formData, 
                co_leader_id: value ? parseInt(value) : null 
              })
            }
            options={[
              { value: "", label: "No co-leader assigned" },
              ...memberOptions
            ]}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value })
          }
          options={CELL_STATUSES}
          disabled={isLoading}
        />
      </div>

      {/* Debug info - remove in production */}
      <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
        <p>Leader ID: {formData.leader_id}</p>
        <p>Co-Leader ID: {formData.co_leader_id}</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : cell ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
