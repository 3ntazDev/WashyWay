import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (password.length < 6) {
        setError("⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        setLoading(false);
        return;
      }

      // تسجيل المستخدم باستخدام supabase
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError("⚠️ خطأ في التسجيل: " + error.message);
        return;
      }

      if (data?.user) {
        // حفظ بيانات المستخدم في جدول users
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            full_name: fullName,
            email: email,
            role: role,
          },
        ]);

        if (insertError) {
          setError("⚠️ خطأ في حفظ البيانات: " + insertError.message);
          return;
        }

        // توجيه المستخدم إلى صفحة إكمال التسجيل
        navigate("/user/complete-registration", { state: { userId: data.user.id } });
      }
    } catch (err) {
      setError("⚠️ حدث خطأ غير متوقع أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>التسجيل</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="الاسم الكامل"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">اختر الدور</option>
          <option value="user">مستخدم</option>
          <option value="admin">مشرف</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل"}
        </button>
      </form>
    </div>
  );
};

export default UserRegister;