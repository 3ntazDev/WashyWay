import { supabase } from "../supabaseClient"; // ✅ الحل الصحيح

// ✅ تسجيل الدخول وجلب الدور بناءً على الجداول
export const signInAndFetchRole = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.user) {
    // تحقق مما إذا كان المستخدم صاحب مغسلة
    const { data: ownerData } = await supabase
      .from("carWashOwners")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (ownerData) {
      return { user: data.user, role: "carWashOwner" };
    }

    return { user: data.user, role: "customer" };
  }

  return { error: "لم يتم العثور على المستخدم" };
};
