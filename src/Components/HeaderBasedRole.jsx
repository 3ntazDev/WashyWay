import HeaderForUser from "./HeaderForUser";
// import HeaderForOwner from "./HeaderForOwner";
import HeaderDefault from "./Header";
import { useAuth } from "../Auth/useAuth";
import Header from "./Header";

const HeaderBasedRole = () => {
  const { user, role } = useAuth(); // ✅ الآن يتم تحديث الدور فورًا عند تغيير الحالة

  if (!user) return <Header />; // ✅ إذا لم يكن مسجل دخول، أظهر الهيدر العادي
  if (role === "customer") return <HeaderForUser />; // ✅ للمستخدمين العاديين
  if (role === "carWashOwner") return <HeaderForOwner />; // ✅ لأصحاب المغاسل

  return null;
};

export default HeaderBasedRole;
