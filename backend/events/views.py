from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Event, Attendance
from .serializer import EventSerializer, AttendanceSerializer
from accounts.permissions import IsSuperAdmin, IsPastor, IsAdministrator


class EventViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Events.
    
    Permissions:
    - List/Retrieve: Any authenticated user
    - Create: Admin, Pastor, Super Admin
    - Update/Delete: Admin, Pastor, Super Admin
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    def get_permissions(self):
        """Custom permissions based on action"""
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter events by various parameters"""
        queryset = Event.objects.all()
        
        # Filter by status
        status = self.request.query_params.get("status", None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by category
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by date range
        start_date = self.request.query_params.get("start_date", None)
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        
        end_date = self.request.query_params.get("end_date", None)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
        
        # Filter upcoming events
        upcoming = self.request.query_params.get("upcoming", None)
        if upcoming:
            queryset = queryset.filter(
                start_date__gte=timezone.now().date(),
                status__in=["scheduled", "ongoing"]
            )
        
        return queryset

    @action(detail=True, methods=["get"])
    def attendance(self, request, pk=None):
        """Get attendance records for an event"""
        event = self.get_object()
        attendance_records = event.attendance_records.all()
        serializer = AttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def mark_attendance(self, request, pk=None):
        """Mark attendance for a member in this event"""
        event = self.get_object()
        member_id = request.data.get("member_id")
        status = request.data.get("status", "present")
        
        if not member_id:
            return Response(
                {"error": "member_id is required"},
                status=400
            )
        
        # Create or update attendance record
        attendance, created = Attendance.objects.update_or_create(
            event=event,
            member_id=member_id,
            defaults={"status": status}
        )
        
        # Update actual attendance count
        event.actual_attendance = event.attendance_records.filter(
            status="present"
        ).count()
        event.save()
        
        serializer = AttendanceSerializer(attendance)
        return Response(
            {**serializer.data, "created": created},
            status=201 if created else 200
        )

    @action(detail=True, methods=["post"])
    def bulk_mark_attendance(self, request, pk=None):
        """Mark attendance for multiple members at once"""
        event = self.get_object()
        members = request.data.get("members", [])  # List of {member_id, status}
        
        if not members:
            return Response(
                {"error": "members list is required"},
                status=400
            )
        
        created_count = 0
        updated_count = 0
        
        for member_data in members:
            member_id = member_data.get("member_id")
            status = member_data.get("status", "present")
            
            if member_id:
                attendance, created = Attendance.objects.update_or_create(
                    event=event,
                    member_id=member_id,
                    defaults={"status": status}
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
        
        # Update actual attendance count
        event.actual_attendance = event.attendance_records.filter(
            status="present"
        ).count()
        event.save()
        
        return Response({
            "message": "Attendance marked successfully",
            "created": created_count,
            "updated": updated_count,
            "total_attendance": event.actual_attendance
        }, status=200)


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Attendance records.
    """
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter by event or member"""
        queryset = Attendance.objects.all()
        event_id = self.request.query_params.get("event_id", None)
        member_id = self.request.query_params.get("member_id", None)
        
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        return queryset
