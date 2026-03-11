import { Member } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Edit } from "lucide-react"

interface MemberDetailProps {
  member: Member
  onClose: () => void
  onEdit: () => void
}

export function MemberDetail({ member, onClose, onEdit }: MemberDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {member.first_name[0]}{member.last_name[0]}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {member.first_name} {member.last_name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={member.is_active ? "success" : "secondary"}>
                {member.is_active ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Member since {formatDate(member.joined_date)}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Contact Information
            </h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="text-sm">{member.email || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>
                <p className="text-sm">{member.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Personal Information
            </h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Gender:</span>
                <p className="text-sm capitalize">{member.gender}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Date of Birth:
                </span>
                <p className="text-sm">
                  {member.date_of_birth
                    ? formatDate(member.date_of_birth)
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Address
            </h3>
            <p className="text-sm mt-2">
              {member.address || "Not provided"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Membership Details
            </h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">
                  Member ID:
                </span>
                <p className="text-sm">#{member.id.toString().padStart(6, "0")}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Joined Date:
                </span>
                <p className="text-sm">{formatDate(member.joined_date)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for future sections */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Additional Information
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-muted-foreground">Cell Group</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-muted-foreground">Department</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-muted-foreground">Attendance</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Cell, department, and attendance tracking coming soon
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
