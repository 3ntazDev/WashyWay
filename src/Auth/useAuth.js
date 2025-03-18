import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.user) {
        console.log("User fetched:", data.user);
        setUser(data.user);
        fetchUserRole(data.user.id);
      } else {
        setUser(null);
        setRole(null); // Clear role if no user is logged in
      }
    };

    const fetchUserRole = async (userId) => {
      if (!userId) return;
      
      const { data: userData, error } = await supabase
        .from("users") // Assuming users table holds user roles
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching role:", error);
      } else {
        if (userData?.role === "owner") {
          console.log("User is owner");
          setRole("owner");
        } else {
          console.log("User is regular user");
          setRole("user");
        }
      }
    };

    fetchUser();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      console.log("Auth state changed", session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null); // Clear role on logout
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, role };
};
