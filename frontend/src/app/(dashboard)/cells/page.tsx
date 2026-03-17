"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cellsApi } from "@/lib/api"
import { Cell } from "@/types"
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
} from "@/components/ui/dialog"
import { CellForm } from "@/components/cells/cell-form"
import { CellDetail } from "@/components/cells/cell-detail"
import { Plus, Search, Edit, Trash2, Eye, Users } from "lucide-react"

export default function CellsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [editingCell, setEditingCell] = useState<Cell | null>(null)
  const [viewingCell, setViewingCell] = useState<Cell | null>(null)

  // Fetch cells
  const { data: cells, isLoading } = useQuery({
    queryKey: ["cells"],
    queryFn: async () => {
      const response = await cellsApi.getAll()
      return response.data
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => cellsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cells"] })
    },
  })

  // Filter cells by search and status
  const filteredCells = cells?.filter((cell: Cell) => {
    const matchesSearch = cell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cell.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cell.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || cell.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const handleEdit = (cell: Cell) => {
    setEditingCell(cell)
    setIsFormOpen(true)
  }

  const handleView = (cell: Cell) => {
    setViewingCell(cell)
    setIsDetailOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this cell? This will not delete the members, only the cell group.")) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingCell(null)
    queryClient.invalidateQueries({ queryKey: ["cells"] })
    queryClient.invalidateQueries({ queryKey: ["members"] })
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

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "Active",
      inactive: "Inactive",
      on_hold: "On Hold",
    }
    return statusMap[status] || status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cells</h1>
          <p className="text-muted-foreground">
            Manage small groups and cell ministries
          </p>
        </div>
        <Button onClick={() => {
          setEditingCell(null)
          setIsFormOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Cell
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_hold">On Hold</option>
          </select>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredCells.length} of {cells?.length || 0} cells
          </div>
        </div>
      </div>

      {/* Cells Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Meeting Day</TableHead>
              <TableHead>Meeting Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Leader</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading cells...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCells.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchTerm || statusFilter 
                    ? "No cells found matching your filters" 
                    : "No cells yet. Add your first cell group!"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredCells.map((cell: Cell) => (
                <TableRow key={cell.id}>
                  <TableCell className="font-medium">
                    <div>
                      {cell.name}
                      {cell.description && (
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {cell.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {cell.meeting_day ? (
                      <span className="capitalize">{cell.meeting_day}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {cell.meeting_time || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {cell.location || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {cell.leader_details ? (
                      <div>
                        <p className="font-medium">
                          {cell.leader_details.first_name} {cell.leader_details.last_name}
                        </p>
                        {cell.co_leader_details && (
                          <p className="text-xs text-muted-foreground">
                            Co: {cell.co_leader_details.first_name} {cell.co_leader_details.last_name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No leader</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{cell.member_count || cell.members?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(cell.status)}>
                      {formatStatus(cell.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(cell)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(cell)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cell.id)}
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

      {/* Cell Form Dialog (Add/Edit) */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCell ? "Edit Cell" : "Add New Cell"}
            </DialogTitle>
          </DialogHeader>
          <CellForm
            cell={editingCell}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingCell(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Cell Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cell Details</DialogTitle>
          </DialogHeader>
          {viewingCell && (
            <CellDetail
              cell={viewingCell}
              onClose={() => {
                setIsDetailOpen(false)
                setViewingCell(null)
              }}
              onEdit={() => {
                setIsDetailOpen(false)
                handleEdit(viewingCell)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
