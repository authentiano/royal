# Church Management System - Complete API Reference

## Base URL
```
http://localhost:8000/api/
```

---

## 🔐 Authentication

### Get Token
```http
POST /auth/token/
Content-Type: application/json

{
  "username": "superadmin",
  "password": "pass123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "role": "superadmin",
  "username": "superadmin",
  "email": "superadmin@church.com",
  "first_name": "",
  "last_name": ""
}
```

### Refresh Token
```http
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

---

## 👥 Members API

### Endpoints
- `GET /api/members/members/` - List all members
- `POST /api/members/members/` - Create member
- `GET /api/members/members/{id}/` - Get member details
- `PATCH /api/members/members/{id}/` - Update member
- `DELETE /api/members/members/{id}/` - Delete member

---

## 🏠 Cells API

### Endpoints
- `GET /api/cells/` - List all cells
- `POST /api/cells/` - Create cell
- `GET /api/cells/{id}/` - Get cell details
- `PATCH /api/cells/{id}/` - Update cell
- `DELETE /api/cells/{id}/` - Delete cell
- `GET /api/cells/{id}/members/` - Get cell members
- `POST /api/cells/{id}/add_member/` - Add member to cell
- `POST /api/cells/{id}/remove_member/` - Remove member from cell
- `GET /api/cell-members/` - List all cell memberships
- `GET /api/cell-members/{id}/` - Get membership details

---

## 🏢 Departments API

### Endpoints
- `GET /api/departments/` - List all departments
- `POST /api/departments/` - Create department
- `GET /api/departments/{id}/` - Get department details
- `PATCH /api/departments/{id}/` - Update department
- `DELETE /api/departments/{id}/` - Delete department
- `GET /api/departments/{id}/members/` - Get department members
- `POST /api/departments/{id}/add_member/` - Add member to department
- `POST /api/departments/{id}/remove_member/` - Remove member from department
- `GET /api/department-members/` - List all department memberships
- `GET /api/department-members/{id}/` - Get membership details

---

## 📅 Events API

### Endpoints
- `GET /api/events/` - List all events
- `POST /api/events/` - Create event
- `GET /api/events/{id}/` - Get event details
- `PATCH /api/events/{id}/` - Update event
- `DELETE /api/events/{id}/` - Delete event
- `GET /api/events/?upcoming=true` - Get upcoming events
- `GET /api/events/{id}/attendance/` - Get event attendance
- `POST /api/events/{id}/mark_attendance/` - Mark single member attendance
- `POST /api/events/{id}/bulk_mark_attendance/` - Mark multiple members
- `GET /api/attendance/` - List all attendance records
- `GET /api/attendance/{id}/` - Get attendance details

### Query Parameters (Events)
- `status` - Filter by status (scheduled, ongoing, completed, cancelled)
- `category` - Filter by category (service, meeting, conference, etc.)
- `start_date` - Filter events from this date
- `end_date` - Filter events until this date
- `upcoming=true` - Get only upcoming events

---

## 💰 Finance API

### Transaction Categories
- `GET /api/finance/categories/` - List categories
- `POST /api/finance/categories/` - Create category
- `GET /api/finance/categories/{id}/` - Get category
- `PATCH /api/finance/categories/{id}/` - Update category
- `DELETE /api/finance/categories/{id}/` - Delete category

### Transactions
- `GET /api/finance/transactions/` - List transactions
- `POST /api/finance/transactions/` - Create transaction
- `GET /api/finance/transactions/{id}/` - Get transaction
- `PATCH /api/finance/transactions/{id}/` - Update transaction
- `DELETE /api/finance/transactions/{id}/` - Delete transaction
- `POST /api/finance/transactions/{id}/approve/` - Approve transaction
- `POST /api/finance/transactions/{id}/reject/` - Reject transaction
- `GET /api/finance/transactions/summary/` - Get financial summary

### Transaction Query Parameters
- `type` - Filter by type (income, expense)
- `category_id` - Filter by category
- `status` - Filter by status (pending, approved, rejected)
- `member_id` - Filter by member
- `start_date` - Filter from date
- `end_date` - Filter until date

### Budgets
- `GET /api/finance/budgets/` - List budgets
- `POST /api/finance/budgets/` - Create budget
- `GET /api/finance/budgets/{id}/` - Get budget
- `PATCH /api/finance/budgets/{id}/` - Update budget
- `DELETE /api/finance/budgets/{id}/` - Delete budget

### Budget Query Parameters
- `year` - Filter by year
- `period` - Filter by period (monthly, quarterly, yearly)
- `category_id` - Filter by category

### Expense Claims
- `GET /api/finance/expense-claims/` - List claims
- `POST /api/finance/expense-claims/` - Create claim
- `GET /api/finance/expense-claims/{id}/` - Get claim
- `PATCH /api/finance/expense-claims/{id}/` - Update claim
- `DELETE /api/finance/expense-claims/{id}/` - Delete claim
- `POST /api/finance/expense-claims/{id}/submit/` - Submit claim
- `POST /api/finance/expense-claims/{id}/approve/` - Approve claim
- `POST /api/finance/expense-claims/{id}/mark_paid/` - Mark as paid

---

## 🔑 Role-Based Permissions

| Role | Members | Cells | Departments | Events | Finance |
|------|---------|-------|-------------|--------|---------|
| Super Admin | Full | Full | Full | Full | Full |
| Pastor | View | Manage | Manage | Manage | View + Approve |
| Administrator | Manage | Manage | Manage | Manage | View + Approve |
| Finance Officer | View | View | View | View | Manage |
| Cell Leader | View | View | View | View | View |
| Evangelism | View | View | View | View | View |

---

## 📊 Example Workflows

### 1. Create Event and Mark Attendance

```http
# Create Event
POST /api/events/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sunday Service",
  "category": "service",
  "start_date": "2024-03-17",
  "start_time": "09:00:00",
  "end_time": "11:00:00",
  "location": "Main Church",
  "expected_attendance": 200
}

# Mark Attendance
POST /api/events/1/mark_attendance/
Authorization: Bearer <token>
Content-Type: application/json

{
  "member_id": 5,
  "status": "present"
}

# Bulk Mark Attendance
POST /api/events/1/bulk_mark_attendance/
Authorization: Bearer <token>
Content-Type: application/json

{
  "members": [
    {"member_id": 1, "status": "present"},
    {"member_id": 2, "status": "present"},
    {"member_id": 3, "status": "late"}
  ]
}
```

### 2. Record Tithe and Get Summary

```http
# Create Tithe Transaction
POST /api/finance/transactions/
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000,
  "type": "income",
  "category_id": 1,
  "payment_method": "mobile_money",
  "member_id": 5,
  "reference": "TITHE-2024-03-17"
}

# Get Financial Summary
GET /api/finance/transactions/summary/
Authorization: Bearer <token>

# Response
{
  "total_income": 500000,
  "total_expense": 150000,
  "balance": 350000,
  "currency": "UGX"
}
```

### 3. Add Member to Cell and Department

```http
# Add to Cell
POST /api/cells/1/add_member/
Authorization: Bearer <token>
Content-Type: application/json

{
  "member_id": 5
}

# Add to Department
POST /api/departments/1/add_member/
Authorization: Bearer <token>
Content-Type: application/json

{
  "member_id": 5,
  "role": "member"
}
```

---

## 🎯 Quick Test Commands (curl)

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"pass123"}' | jq -r '.access')

# List members
curl -s http://localhost:8000/api/members/members/ \
  -H "Authorization: Bearer $TOKEN"

# Create event
curl -s -X POST http://localhost:8000/api/events/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Youth Meeting",
    "category": "meeting",
    "start_date": "2024-03-20",
    "start_time": "18:00:00"
  }'

# Get finance summary
curl -s http://localhost:8000/api/finance/transactions/summary/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Notes

- All timestamps are in UTC
- Dates are in `YYYY-MM-DD` format
- Times are in `HH:MM:SS` format
- Currency is in UGX (Ugandan Shillings)
- Requires authentication for all endpoints
- Role-based access control enforced

---

## 🚀 Next Steps

1. **Frontend Development** - Build Next.js + TypeScript UI
2. **Dashboard** - Analytics and reporting
3. **Notifications** - Email/SMS alerts
4. **Reports** - PDF exports for finance, attendance
5. **Multi-branch Support** - Add branch field to models
6. **Media Library** - Sermons, photos, documents
