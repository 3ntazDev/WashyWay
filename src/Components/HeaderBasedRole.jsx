import { useAuth } from "../Auth/useAuth"
import Header from "./Header"
import HeaderForUser from "./HeaderForUser"

const HeaderBasedRole = () => {
  const { user, role } = useAuth() // Get user and role from auth context

  if (!user) return <Header /> // If not logged in, show regular header
  
  // If user is an owner, return null (don't show any header)
  if (role === "owner") return null // For owners, don't show any header
  
  if (role === "user") return <HeaderForUser /> // For users, show the user header

  return null // Return null for other roles or undefined behavior
}

export default HeaderBasedRole
