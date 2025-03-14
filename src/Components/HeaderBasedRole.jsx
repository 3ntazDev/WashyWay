"use client"

import { useAuth } from "../Auth/useAuth";
import Header from "./Header"

const HeaderBasedRole = () => {
  const { user, role } = useAuth() // Now role updates immediately when state changes

  if (!user) return <Header /> // If not logged in, show regular header
  if (role === "customer") return <Header /> // For regular users

  return null
}

export default HeaderBasedRole

