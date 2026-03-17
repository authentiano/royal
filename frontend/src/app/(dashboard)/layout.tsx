"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DashboardHome({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Simple check - if no token, redirect to login
    const token = localStorage.getItem("access_token")
    const user = localStorage.getItem("user")

    if (!token || !user) {
      router.push("/login")
    }
  }, [router])

  return <DashboardLayout>{children}</DashboardLayout>
}
