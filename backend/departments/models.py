from django.db import models
from members.models import Member

# Create your models here.

class Department(models.Model):
    """
    Represents a ministry/department in the church.
    Examples: Choir, Ushering, Media, Children's Church, etc.
    """
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    leader = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="led_departments"
    )
    co_leader = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="co_led_departments"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    date_established = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return self.name

    def member_count(self):
        """Return the number of members in this department"""
        return self.members.count()


class DepartmentMember(models.Model):
    """
    Links members to departments with membership status and role.
    """
    ROLE_CHOICES = [
        ("member", "Member"),
        ("leader", "Leader"),
        ("co_leader", "Co-Leader"),
        ("secretary", "Secretary"),
        ("treasurer", "Treasurer"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("pending", "Pending"),
    ]

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="members"
    )
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name="department_memberships"
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    joined_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["department", "member"]
        ordering = ["-joined_date"]
        verbose_name = "Department Member"
        verbose_name_plural = "Department Members"

    def __str__(self):
        return f"{self.member.first_name} {self.member.last_name} - {self.department.name} ({self.role})"
