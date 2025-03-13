import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CompleteRegistration = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("لم يتم العثور على معرف المستخدم");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        setError("فشل في جلب بيانات المستخدم");
      } else {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedData = { ...userData };
    delete updatedData.id; // إزالة الـ ID لتجنب تحديثه

    const { error } = await supabase
      .from("users")
      .update(updatedData)
      .eq("id", userId);

    if (error) {
      setError("فشل في تحديث البيانات");
    } else {
      navigate("/user/dashboard");
    }
  };

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>إكمال البيانات</h2>
      <form onSubmit={handleUpdate}>
        {Object.entries(userData).map(([key, value]) =>
          key !== "id" ? (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
                value={value || ""}
                onChange={(e) =>
                  setUserData({ ...userData, [key]: e.target.value })
                }
                required
              />
            </div>
          ) : null
        )}
        <button type="submit">حفظ وإكمال</button>
      </form>
    </div>
  );
};

export default CompleteRegistration;