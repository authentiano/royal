from django.db import models
from members.models import Member

# Create your models here.

class Event(models.Model):
    """
    Represents church events, programs, and services.
    """
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    CATEGORY_CHOICES = [
        ("service", "Church Service"),
        ("meeting", "Meeting"),
        ("conference", "Conference"),
        ("fellowship", "Fellowship"),
        ("evangelism", "Evangelism"),
        ("training", "Training"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="service")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    
    # Date and Time
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    
    # Location
    location = models.CharField(max_length=200, blank=True)
    venue = models.CharField(max_length=200, blank=True)
    
    # Organization
    created_by = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_events"
    )
    
    # Attendance tracking
    expected_attendance = models.IntegerField(default=0)
    actual_attendance = models.IntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date", "-start_time"]
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return self.name

    def duration(self):
        """Calculate event duration in hours"""
        if self.start_time and self.end_time:
            delta = self.end_time - self.start_time
            return delta.seconds / 3600
        return 0


class Attendance(models.Model):
    """
    Tracks attendance for events.
    """
    STATUS_CHOICES = [
        ("present", "Present"),
        ("absent", "Absent"),
        ("late", "Late"),
        ("excused", "Excused"),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="attendance_records")
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="event_attendance")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="present")
    checked_in_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["event", "member"]
        ordering = ["member__first_name"]
        verbose_name = "Attendance"
        verbose_name_plural = "Attendance"

    def __str__(self):
        return f"{self.member.first_name} {self.member.last_name} - {self.event.name}"
