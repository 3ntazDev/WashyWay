import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchUserRole(data.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    };

    const fetchUserRole = async (userId) => {
      if (!userId) return;
      
      // ✅ التحقق من إذا كان المستخدم صاحب مغسلة أو كستمر
      const { data: ownerData } = await supabase
        .from("carWashOwners")
        .select("id")
        .eq("id", userId)
        .single();

      if (ownerData) {
        setRole("carWashOwner");
      } else {
        setRole("customer");
      }
    };

    fetchUser();

    // ✅ تحديث الحالة عند تغيير حالة المصادقة
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, role };
};
