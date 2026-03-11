"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { membersApi } from "@/lib/api"
import { Member } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MemberForm } from "@/components/members/member-form"
import { MemberDetail } from "@/components/members/member-detail"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function MembersPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [viewingMember, setViewingMember] = useState<Member | null>(null)

  // Fetch members
  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await membersApi.getAll()
      return response.data
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => membersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] })
    },
  })

  // Filter members by search
  const filteredMembers = members?.filter((member: Member) =>
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  ) || []

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setIsFormOpen(true)
  }

  const handleView = (member: Member) => {
    setViewingMember(member)
    setIsDetailOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this member?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingMember(null)
    queryClient.invalidateQueries({ queryKey: ["members"] })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage church members and their information
          </p>
        </div>
        <Button onClick={() => {
          setEditingMember(null)
          setIsFormOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredMembers.length} of {members?.length || 0} members
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading members...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? "No members found matching your search" : "No members yet. Add your first member!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member: Member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.first_name} {member.last_name}
                  </TableCell>
                  <TableCell>{member.email || "-"}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell className="capitalize">{member.gender}</TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? "success" : "secondary"}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(member)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Member Form Dialog (Add/Edit) */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Member" : "Add New Member"}
            </DialogTitle>
          </DialogHeader>
          <MemberForm
            member={editingMember}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingMember(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Member Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {viewingMember && (
            <MemberDetail
              member={viewingMember}
              onClose={() => {
                setIsDetailOpen(false)
                setViewingMember(null)
              }}
              onEdit={() => {
                setIsDetailOpen(false)
                handleEdit(viewingMember)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
