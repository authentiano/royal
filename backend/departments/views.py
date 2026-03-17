from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Department, DepartmentMember
from .serializer import DepartmentSerializer, DepartmentMemberSerializer
from accounts.permissions import IsSuperAdmin, IsPastor, IsAdministrator


class IsSuperAdminOrPastorOrAdministrator(BasePermission):
    """Custom permission for Super Admin, Pastor, or Administrator"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ["superadmin", "pastor", "administrator"]


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Departments.

    Permissions:
    - List/Retrieve: Any authenticated user
    - Create: Admin, Pastor, Super Admin
    - Update/Delete: Admin, Pastor, Super Admin
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        """Custom permissions based on action"""
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSuperAdminOrPastorOrAdministrator()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter departments by status"""
        queryset = Department.objects.all()
        status = self.request.query_params.get("status", None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=True, methods=["get"])
    def members(self, request, pk=None):
        """Get all members in a specific department"""
        department = self.get_object()
        dept_members = department.members.all()
        serializer = DepartmentMemberSerializer(dept_members, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_member(self, request, pk=None):
        """Add a member to a department"""
        department = self.get_object()
        member_id = request.data.get("member_id")
        role = request.data.get("role", "member")
        status = request.data.get("status", "active")
        
        if not member_id:
            return Response(
                {"error": "member_id is required"},
                status=400
            )
        
        # Check if member already exists in department
        existing = DepartmentMember.objects.filter(
            department=department, member_id=member_id
        ).first()
        if existing:
            return Response(
                {"error": "Member already in this department"},
                status=400
            )
        
        dept_member = DepartmentMember.objects.create(
            department=department,
            member_id=member_id,
            role=role,
            status=status
        )
        serializer = DepartmentMemberSerializer(dept_member)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=["post"])
    def remove_member(self, request, pk=None):
        """Remove a member from a department"""
        department = self.get_object()
        member_id = request.data.get("member_id")
        
        if not member_id:
            return Response(
                {"error": "member_id is required"},
                status=400
            )
        
        dept_member = DepartmentMember.objects.filter(
            department=department, member_id=member_id
        ).first()
        if not dept_member:
            return Response(
                {"error": "Member not found in this department"},
                status=404
            )
        
        dept_member.delete()
        return Response({"message": "Member removed from department"}, status=200)


class DepartmentMemberViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Department Members.
    """
    queryset = DepartmentMember.objects.all()
    serializer_class = DepartmentMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by department or member"""
        queryset = DepartmentMember.objects.all()
        department_id = self.request.query_params.get("department_id", None)
        member_id = self.request.query_params.get("member_id", None)
        
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        return queryset
