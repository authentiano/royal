from rest_framework import serializers
from members.models import Member
from .models import Department, DepartmentMember
from members.serializer import MemberSerializer


class DepartmentMemberSerializer(serializers.ModelSerializer):
    """Serializer for DepartmentMember"""
    member_details = MemberSerializer(source="member", read_only=True)
    member_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        source="member",
        write_only=True
    )

    class Meta:
        model = DepartmentMember
        fields = [
            "id", "department", "member", "member_id", "member_details",
            "role", "status", "joined_date", "notes", "created_at", "updated_at"
        ]
        read_only_fields = ["joined_date", "created_at", "updated_at"]


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department"""
    leader_details = MemberSerializer(source="leader", read_only=True)
    co_leader_details = MemberSerializer(source="co_leader", read_only=True)
    leader_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        source="leader",
        write_only=True,
        required=False,
        allow_null=True
    )
    co_leader_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        source="co_leader",
        write_only=True,
        required=False,
        allow_null=True
    )
    member_count = serializers.SerializerMethodField()
    members = DepartmentMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = [
            "id", "name", "description", "leader", "leader_id", "leader_details",
            "co_leader", "co_leader_id", "co_leader_details",
            "status", "date_established", "member_count", "members",
            "created_at", "updated_at"
        ]
        read_only_fields = ["date_established", "created_at", "updated_at"]

    def get_member_count(self, obj):
        return obj.members.filter(status="active").count()
