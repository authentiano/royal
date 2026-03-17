"use client"

import { Cell, Member } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface CellDetailProps {
  cell: Cell
  onClose: () => void
  onEdit: () => void
}

export function CellDetail({ cell, onClose, onEdit }: CellDetailProps) {
  const activeMembers = cell.members?.filter(
    (m) => m.status === "active"
  ) || []

  const formatMeetingDay = (day: string | null) => {
    if (!day) return null
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "Active",
      inactive: "Inactive",
      on_hold: "On Hold",
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "on_hold":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{cell.name}</h2>
          <p className="text-muted-foreground">{cell.description || "No description"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Badge variant={getStatusVariant(cell.status)}>
            {formatStatus(cell.status)}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Meeting Day</p>
          <p className="text-sm">{formatMeetingDay(cell.meeting_day) || "Not set"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Meeting Time</p>
          <p className="text-sm">{cell.meeting_time || "Not set"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Location</p>
          <p className="text-sm">{cell.location || "Not set"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Leader</p>
          <p className="text-sm">
            {cell.leader_details 
              ? `${cell.leader_details.first_name} ${cell.leader_details.last_name}`
              : "Not assigned"
            }
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Co-Leader</p>
          <p className="text-sm">
            {cell.co_leader_details 
              ? `${cell.co_leader_details.first_name} ${cell.co_leader_details.last_name}`
              : "Not assigned"
            }
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Date Established</p>
          <p className="text-sm">{new Date(cell.date_established).toLocaleDateString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Member Count</p>
          <p className="text-sm">{activeMembers.length} active members</p>
        </div>
      </div>

      {/* Members Section */}
      {activeMembers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Cell Members ({activeMembers.length})</h3>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Name</th>
                  <th className="px-4 py-2 text-left font-medium">Phone</th>
                  <th className="px-4 py-2 text-left font-medium">Joined Date</th>
                  <th className="px-4 py-2 text-left font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {activeMembers.map((membership) => {
                  const member = membership.member_details
                  const isLeader = cell.leader === member.id
                  const isCoLeader = cell.co_leader === member.id
                  const role = isLeader ? "Leader" : isCoLeader ? "Co-Leader" : "Member"
                  
                  return (
                    <tr key={membership.id} className="border-t">
                      <td className="px-4 py-2 font-medium">
                        {member.first_name} {member.last_name}
                      </td>
                      <td className="px-4 py-2">{member.phone}</td>
                      <td className="px-4 py-2">
                        {new Date(membership.joined_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={role === "Leader" ? "default" : role === "Co-Leader" ? "secondary" : "outline"}>
                          {role}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
