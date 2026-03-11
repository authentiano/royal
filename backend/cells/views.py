from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cell, CellMember
from .serializer import CellSerializer, CellMemberSerializer
from accounts.permissions import IsSuperAdmin, IsPastor, IsAdministrator, IsCellLeader


class CellViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Cells.
    
    Permissions:
    - List/Retrieve: Any authenticated user
    - Create: Admin, Pastor, Super Admin
    - Update/Delete: Admin, Pastor, Super Admin
    """
    queryset = Cell.objects.all()
    serializer_class = CellSerializer
    
    def get_permissions(self):
        """Custom permissions based on action"""
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter cells by status"""
        queryset = Cell.objects.all()
        status = self.request.query_params.get("status", None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=True, methods=["get"])
    def members(self, request, pk=None):
        """Get all members in a specific cell"""
        cell = self.get_object()
        cell_members = cell.members.all()
        serializer = CellMemberSerializer(cell_members, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_member(self, request, pk=None):
        """Add a member to a cell"""
        cell = self.get_object()
        member_id = request.data.get("member_id")
        status = request.data.get("status", "active")
        
        if not member_id:
            return Response(
                {"error": "member_id is required"},
                status=400
            )
        
        # Check if member already exists in cell
        existing = CellMember.objects.filter(cell=cell, member_id=member_id).first()
        if existing:
            return Response(
                {"error": "Member already in this cell"},
                status=400
            )
        
        cell_member = CellMember.objects.create(
            cell=cell,
            member_id=member_id,
            status=status
        )
        serializer = CellMemberSerializer(cell_member)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=["post"])
    def remove_member(self, request, pk=None):
        """Remove a member from a cell"""
        cell = self.get_object()
        member_id = request.data.get("member_id")
        
        if not member_id:
            return Response(
                {"error": "member_id is required"},
                status=400
            )
        
        cell_member = CellMember.objects.filter(cell=cell, member_id=member_id).first()
        if not cell_member:
            return Response(
                {"error": "Member not found in this cell"},
                status=404
            )
        
        cell_member.delete()
        return Response({"message": "Member removed from cell"}, status=200)


class CellMemberViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Cell Members.
    """
    queryset = CellMember.objects.all()
    serializer_class = CellMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by cell or member"""
        queryset = CellMember.objects.all()
        cell_id = self.request.query_params.get("cell_id", None)
        member_id = self.request.query_params.get("member_id", None)
        
        if cell_id:
            queryset = queryset.filter(cell_id=cell_id)
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        return queryset
