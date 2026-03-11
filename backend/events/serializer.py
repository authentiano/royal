from rest_framework import serializers
from members.models import Member
from .models import Event, Attendance
from members.serializer import MemberSerializer


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance"""
    member_details = MemberSerializer(source="member", read_only=True)
    member_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        source="member",
        write_only=True
    )

    class Meta:
        model = Attendance
        fields = [
            "id", "event", "member", "member_id", "member_details",
            "status", "checked_in_at", "notes", "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event"""
    created_by_details = MemberSerializer(source="created_by", read_only=True)
    created_by_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        source="created_by",
        write_only=True,
        required=False,
        allow_null=True
    )
    attendance_count = serializers.SerializerMethodField()
    attendance = AttendanceSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id", "name", "description", "category", "status",
            "start_date", "end_date", "start_time", "end_time",
            "location", "venue",
            "created_by", "created_by_id", "created_by_details",
            "expected_attendance", "actual_attendance",
            "attendance_count", "attendance",
            "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at", "actual_attendance"]

    def get_attendance_count(self, obj):
        return obj.attendance_records.filter(status="present").count()
