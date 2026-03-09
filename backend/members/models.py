from django.db import models

# Create your models here.

class Member(models.Model):
    GENDER_CHOiCES = [
        ("male", "Male"),
        ("female", "Female")
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=10)
    gender = models.CharField(max_length=10, choices=GENDER_CHOiCES)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True)
    joined_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    
