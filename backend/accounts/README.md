# Role-Based Access Control (RBAC) Guide

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    SUPER ADMIN (6)                       │
│  - Full system access, all permissions                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      PASTOR (5)                          │
│  - Oversees all church operations                        │
│  - Access to all departments except superadmin-only      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   ADMINISTRATOR (4)                      │
│  - Manages day-to-day operations                         │
│  - Access to members, departments, events                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   FINANCE OFFICER (3)                    │
│  - Manages church finances                               │
│  - Access to financial records and reports               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    CELL LEADER (2)                       │
│  - Leads cell groups                                     │
│  - Access to cell group members and activities           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  EVANGELISM TEAM (1)                     │
│  - Outreach and evangelism activities                    │
│  - Basic access to evangelism records                    │
└─────────────────────────────────────────────────────────┘
```

## Available Permission Classes

Import from `accounts.permissions`:

```python
from accounts.permissions import (
    IsSuperAdmin,
    IsPastor,
    IsAdministrator,
    IsFinanceOfficer,
    IsCellLeader,
    IsEvangelism,
    IsAuthenticatedRole,
)
```

### Usage in Views

```python
from rest_framework.viewsets import ModelViewSet
from accounts.permissions import IsAdministrator, IsSuperAdmin

class MemberViewSet(ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    
    # Option 1: Single role
    permission_classes = [IsSuperAdmin]
    
    # Option 2: Multiple roles (OR logic)
    permission_classes = [IsAdministrator | IsSuperAdmin]
    
    # Option 3: Any authenticated user
    permission_classes = [IsAuthenticatedRole]
```

### Action-Based Permissions

```python
from accounts.permissions import IsAdministrator, IsSuperAdmin, IsAuthenticatedRole

class MemberViewSet(ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only admins can modify
            return [IsAdministrator() | IsSuperAdmin()]
        elif self.action == 'retrieve':
            # Any authenticated user can view single record
            return [IsAuthenticatedRole()]
        else:
            # List requires admin
            return [IsAdministrator()]
```

## JWT Token Usage

### 1. Obtain Token

**Request:**
```http
POST http://localhost:8000/api/auth/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "role": "superadmin",
  "username": "admin",
  "email": "admin@church.com",
  "first_name": "Admin",
  "last_name": "User"
}
```

### 2. Use Token in Requests

```http
GET http://localhost:8000/api/members/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### 3. Refresh Token

```http
POST http://localhost:8000/api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Utility Functions

Import from `accounts.utils`:

```python
from accounts.utils import (
    get_user_role_display,
    user_has_role,
    user_has_any_role,
    get_allowed_roles_for_minimum,
)
```

### Examples

```python
# Check if user has specific role or higher
if user_has_role(request.user, 'administrator'):
    # User is administrator, pastor, or superadmin
    pass

# Check if user has any of specific roles
if user_has_any_role(request.user, ['superadmin', 'pastor']):
    # User is either superadmin or pastor
    pass

# Get display name of role
role_display = get_user_role_display(user)  # "Super Admin"

# Get all roles equal or higher than finance
allowed = get_allowed_roles_for_minimum('finance')
# Returns: ['finance', 'administrator', 'pastor', 'superadmin']
```

## Testing with Thunder Client / Postman

### Step 1: Create a User
```bash
cd backend
python manage.py createsuperuser
```

Then set the role:
```bash
python manage.py shell
```
```python
from accounts.models import User
user = User.objects.get(username="your_username")
user.role = "superadmin"  # or 'pastor', 'administrator', etc.
user.save()
```

### Step 2: Get Token
```http
POST http://localhost:8000/api/auth/token/
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

### Step 3: Test Protected Endpoint
```http
GET http://localhost:8000/api/members/
Authorization: Bearer <paste_access_token_here>
```

## Common Issues

| Issue | Solution |
|-------|----------|
| `Token has wrong type` | Use access token for endpoints, refresh token only at `/token/refresh/` |
| `401 Unauthorized` | Token expired or invalid - get new token |
| `403 Forbidden` | User doesn't have required role - check role hierarchy |
| Token doesn't reflect new role | Get a new token (roles are encoded at token creation) |

## Best Practices

1. **Always use the highest appropriate permission** - Don't give more access than needed
2. **Use action-based permissions** - Different permissions for read vs write operations
3. **Test with different roles** - Ensure each role has appropriate access
4. **Refresh tokens before expiry** - Access tokens expire after 60 minutes
5. **Keep tokens secure** - Never expose tokens in client-side code or logs
