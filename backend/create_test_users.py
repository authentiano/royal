#!/usr/bin/env python
"""
Create test users for role-based access testing.
Run: python create_test_users.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User

# Create superadmin
superadmin, _ = User.objects.get_or_create(
    username="superadmin",
    defaults={
        "email": "superadmin@church.com",
        "role": "superadmin"
    }
)
superadmin.set_password("pass123")
superadmin.save()

# Create pastor
pastor, _ = User.objects.get_or_create(
    username="pastor",
    defaults={
        "email": "pastor@church.com",
        "role": "pastor"
    }
)
pastor.set_password("pass123")
pastor.save()

# Create administrator
admin, _ = User.objects.get_or_create(
    username="admin",
    defaults={
        "email": "admin@church.com",
        "role": "administrator"
    }
)
admin.set_password("pass123")
admin.save()

# Create finance officer
finance, _ = User.objects.get_or_create(
    username="finance",
    defaults={
        "email": "finance@church.com",
        "role": "finance"
    }
)
finance.set_password("pass123")
finance.save()

# Create cell leader
cellleader, _ = User.objects.get_or_create(
    username="cellleader",
    defaults={
        "email": "cellleader@church.com",
        "role": "cellleader"
    }
)
cellleader.set_password("pass123")
cellleader.save()

print("✓ All test users created!")
print("\nTest Credentials:")
print("  superadmin / pass123  - Super Admin")
print("  pastor     / pass123  - Pastor")
print("  admin      / pass123  - Administrator")
print("  finance    / pass123  - Finance Officer")
print("  cellleader / pass123  - Cell Leader")
