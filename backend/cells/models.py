from django.db import models
from members.models import Member

# Create your models here.

class Cell(models.Model):
    """
    Represents a small group/cell in the church.
    Cells are the basic community unit for fellowship and discipleship.
    """
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("on_hold", "On Hold"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    meeting_day = models.CharField(
        max_length=20,
        choices=[
            ("monday", "Monday"),
            ("tuesday", "Tuesday"),
            ("wednesday", "Wednesday"),
            ("thursday", "Thursday"),
            ("friday", "Friday"),
            ("saturday", "Saturday"),
            ("sunday", "Sunday"),
        ],
        blank=True
    )
    meeting_time = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True)
    leader = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="led_cells"
    )
    co_leader = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="co_led_cells"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    date_established = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Cell"
        verbose_name_plural = "Cells"

    def __str__(self):
        return self.name

    def member_count(self):
        """Return the number of members in this cell"""
        return self.members.count()


class CellMember(models.Model):
    """
    Links members to cells with membership status.
    """
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("pending", "Pending"),
        ("transferred", "Transferred"),
    ]

    cell = models.ForeignKey(Cell, on_delete=models.CASCADE, related_name="members")
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="cell_memberships")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    joined_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["cell", "member"]
        ordering = ["-joined_date"]
        verbose_name = "Cell Member"
        verbose_name_plural = "Cell Members"

    def __str__(self):
        return f"{self.member.first_name} {self.member.last_name} - {self.cell.name}"
