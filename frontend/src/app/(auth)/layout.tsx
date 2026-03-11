import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Royal CMS",
  description: "Sign in to Royal Church Management System",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
