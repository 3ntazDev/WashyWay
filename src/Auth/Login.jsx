import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // تسجيل الدخول باستخدام supabase
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError("⚠️ البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      // جلب بيانات المستخدم من جدول users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (userError || !userData) {
        setError("⚠️ لم يتم العثور على بيانات المستخدم");
        return;
      }

      // التحقق من وجود معلومات ناقصة
      if (Object.values(userData).includes(null)) {
        navigate("/user/complete-registration", { state: { userId: data.user.id } });
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError("⚠️ حدث خطأ غير متوقع أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit" disabled={loading}>
          {loading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>
      </form>
      <p>
        ليس لديك حساب؟ <button onClick={() => navigate("/auth/user/register")}>سجل هنا</button>
      </p>
    </div>
  );
};

export default Login;