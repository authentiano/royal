# Cells & Departments API Documentation

## Base URL
```
http://localhost:8000/api/
```

---

## 🔐 Authentication

All endpoints require authentication. Include JWT token in headers:

```http
Authorization: Bearer <your_access_token>
```

---

## 🏠 Cells API

### List All Cells
```http
GET /cells/
```

**Query Parameters:**
- `status` - Filter by status (active, inactive, on_hold)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Downtown Cell",
    "description": "Weekly fellowship group",
    "meeting_day": "wednesday",
    "meeting_time": "18:30:00",
    "location": "John's House",
    "leader": 1,
    "leader_details": { /* member object */ },
    "co_leader": null,
    "status": "active",
    "member_count": 5,
    "members": [ /* cell members */ ],
    "date_established": "2024-01-15"
  }
]
```

---

### Create Cell
```http
POST /cells/
Content-Type: application/json

{
  "name": "Youth Cell",
  "description": "Cell for young adults",
  "meeting_day": "friday",
  "meeting_time": "19:00:00",
  "location": "Church Hall",
  "leader_id": 1,
  "co_leader_id": 2,
  "status": "active"
}
```

**Permissions:** Super Admin, Pastor, Administrator

---

### Get Cell Details
```http
GET /cells/{id}/
```

---

### Update Cell
```http
PATCH /cells/{id}/
Content-Type: application/json

{
  "name": "Updated Cell Name",
  "status": "inactive"
}
```

---

### Delete Cell
```http
DELETE /cells/{id}/
```

---

### Get Cell Members
```http
GET /cells/{id}/members/
```

**Response:**
```json
[
  {
    "id": 1,
    "cell": 1,
    "member": 1,
    "member_details": { /* member object */ },
    "status": "active",
    "joined_date": "2024-01-15"
  }
]
```

---

### Add Member to Cell
```http
POST /cells/{id}/add_member/
Content-Type: application/json

{
  "member_id": 5,
  "status": "active"
}
```

**Response:** `201 Created`

---

### Remove Member from Cell
```http
POST /cells/{id}/remove_member/
Content-Type: application/json

{
  "member_id": 5
}
```

**Response:** `200 OK`

---

## 🏢 Departments API

### List All Departments
```http
GET /departments/
```

**Query Parameters:**
- `status` - Filter by status (active, inactive)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Choir",
    "description": "Church choir ministry",
    "leader": 3,
    "leader_details": { /* member object */ },
    "co_leader": null,
    "status": "active",
    "member_count": 12,
    "members": [ /* department members */ ],
    "date_established": "2024-01-10"
  }
]
```

---

### Create Department
```http
POST /departments/
Content-Type: application/json

{
  "name": "Ushering Department",
  "description": "Welcoming and seating church members",
  "leader_id": 4,
  "co_leader_id": 5,
  "status": "active"
}
```

**Permissions:** Super Admin, Pastor, Administrator

---

### Get Department Details
```http
GET /departments/{id}/
```

---

### Update Department
```http
PATCH /departments/{id}/
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "inactive"
}
```

---

### Delete Department
```http
DELETE /departments/{id}/
```

---

### Get Department Members
```http
GET /departments/{id}/members/
```

---

### Add Member to Department
```http
POST /departments/{id}/add_member/
Content-Type: application/json

{
  "member_id": 5,
  "role": "member",
  "status": "active"
}
```

**Roles:** member, leader, co_leader, secretary, treasurer

---

### Remove Member from Department
```http
POST /departments/{id}/remove_member/
Content-Type: application/json

{
  "member_id": 5
}
```

---

## 📊 Cell Members API

### List All Cell Memberships
```http
GET /cell-members/
```

**Query Parameters:**
- `cell_id` - Filter by cell
- `member_id` - Filter by member

---

### Get Cell Membership Details
```http
GET /cell-members/{id}/
```

---

### Update Cell Membership
```http
PATCH /cell-members/{id}/
Content-Type: application/json

{
  "status": "inactive",
  "notes": "Transferred to another cell"
}
```

---

### Delete Cell Membership
```http
DELETE /cell-members/{id}/
```

---

## 📊 Department Members API

### List All Department Memberships
```http
GET /department-members/
```

**Query Parameters:**
- `department_id` - Filter by department
- `member_id` - Filter by member

---

### Get Department Membership Details
```http
GET /department-members/{id}/
```

---

### Update Department Membership
```http
PATCH /department-members/{id}/
Content-Type: application/json

{
  "role": "leader",
  "status": "active"
}
```

---

### Delete Department Membership
```http
DELETE /department-members/{id}/
```

---

## 🎯 Example Workflow (Thunder Client)

### 1. Get Token
```http
POST http://localhost:8000/api/auth/token/
Content-Type: application/json

{
  "username": "superadmin",
  "password": "pass123"
}
```

### 2. Create a Cell
```http
POST http://localhost:8000/api/cells/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Men's Fellowship",
  "meeting_day": "saturday",
  "meeting_time": "15:00:00",
  "location": "Main Church",
  "leader_id": 1
}
```

### 3. Add Member to Cell
```http
POST http://localhost:8000/api/cells/1/add_member/
Authorization: Bearer <token>
Content-Type: application/json

{
  "member_id": 2
}
```

### 4. Create Department
```http
POST http://localhost:8000/api/departments/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Media Department",
  "description": "Handles church media and technology"
}
```

---

## 🔑 Permission Summary

| Endpoint | Permissions |
|----------|-------------|
| List/Retrieve Cells | Any authenticated user |
| Create/Update/Delete Cells | Super Admin, Pastor, Administrator |
| List/Retrieve Departments | Any authenticated user |
| Create/Update/Delete Departments | Super Admin, Pastor, Administrator |
| Cell/Department Members | Any authenticated user |

---

## 📝 Notes

- All timestamps are in UTC
- Dates are in `YYYY-MM-DD` format
- Times are in `HH:MM:SS` format
- Soft deletes are NOT implemented - deletions are permanent
