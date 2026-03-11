export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
}

export type UserRole =
  | "superadmin"
  | "pastor"
  | "administrator"
  | "finance"
  | "cellleader"
  | "evangelism"

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface Member {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string
  gender: "male" | "female"
  date_of_birth: string | null
  address: string
  joined_date: string
  is_active: boolean
}

export interface Cell {
  id: number
  name: string
  description: string
  meeting_day: string | null
  meeting_time: string | null
  location: string | null
  leader: number | null
  leader_details: Member | null
  co_leader: number | null
  co_leader_details: Member | null
  status: "active" | "inactive" | "on_hold"
  date_established: string
  member_count: number
  members: CellMember[]
  created_at: string
  updated_at: string
}

export interface CellMember {
  id: number
  cell: number
  member: number
  member_details: Member
  status: "active" | "inactive" | "pending" | "transferred"
  joined_date: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  name: string
  description: string
  leader: number | null
  leader_details: Member | null
  co_leader: number | null
  co_leader_details: Member | null
  status: "active" | "inactive"
  date_established: string
  member_count: number
  members: DepartmentMember[]
  created_at: string
  updated_at: string
}

export interface DepartmentMember {
  id: number
  department: number
  member: number
  member_details: Member
  role: "member" | "leader" | "co_leader" | "secretary" | "treasurer"
  status: "active" | "inactive" | "pending"
  joined_date: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  name: string
  description: string
  category: EventCategory
  status: EventStatus
  start_date: string
  end_date: string | null
  start_time: string | null
  end_time: string | null
  location: string
  venue: string
  created_by: number | null
  created_by_details: Member | null
  expected_attendance: number
  actual_attendance: number
  attendance_count: number
  attendance: Attendance[]
  created_at: string
  updated_at: string
}

export type EventCategory =
  | "service"
  | "meeting"
  | "conference"
  | "fellowship"
  | "evangelism"
  | "training"
  | "other"

export type EventStatus = "scheduled" | "ongoing" | "completed" | "cancelled"

export interface Attendance {
  id: number
  event: number
  member: number
  member_details: Member
  status: AttendanceStatus
  checked_in_at: string | null
  notes: string
  created_at: string
  updated_at: string
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export interface Transaction {
  id: number
  amount: number
  category: number | null
  category_details: TransactionCategory | null
  type: "income" | "expense"
  payment_method: PaymentMethod
  reference: string
  notes: string
  transaction_date: string
  member: number | null
  member_details: Member | null
  status: TransactionStatus
  approved_by: number | null
  approved_by_details: Member | null
  approved_at: string | null
  created_by: number | null
  created_by_details: Member | null
  created_at: string
  updated_at: string
}

export type PaymentMethod =
  | "cash"
  | "mobile_money"
  | "bank_transfer"
  | "cheque"
  | "card"
  | "other"

export type TransactionStatus = "pending" | "approved" | "rejected"

export interface TransactionCategory {
  id: number
  name: string
  type: "income" | "expense"
  description: string
  transaction_count: number
  created_at: string
}

export interface Budget {
  id: number
  category: number
  category_details: TransactionCategory
  amount: number
  period: "monthly" | "quarterly" | "yearly"
  year: number
  month: number | null
  notes: string
  created_at: string
  updated_at: string
}

export interface ExpenseClaim {
  id: number
  claimant: number
  claimant_details: Member
  amount: number
  description: string
  category: number | null
  category_details: TransactionCategory | null
  status: ExpenseClaimStatus
  receipt: string | null
  submitted_at: string | null
  approved_by: number | null
  approved_by_details: Member | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export type ExpenseClaimStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "paid"

export interface FinanceSummary {
  total_income: number
  total_expense: number
  balance: number
  currency: string
}

export interface ApiResponse<T> {
  data: T
  count?: number
  next?: string | null
  previous?: string | null
}

export interface ApiError {
  detail?: string
  message?: string
  [key: string]: any
}
