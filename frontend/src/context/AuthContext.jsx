import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getCurrentUser } from "../api/userApi";

 const AuthContext = createContext({
  clerk_id: null,
  created_at: null,
  email: null,
  id: null,
  name: null,
  role: null,
});

const initialUser = {
  clerk_id: null,
  created_at: null,
  email: null,
  id: null,
  name: null,
  role: null,
};

export function AuthProvider({ children }) {
  const { isSignedIn } = useAuth();
  const [user, setUser] = useState(null); // 👈 IMPORTANT FIX
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        if (!isSignedIn) {
          setUser(null);
          return;
        }

        const data = await getCurrentUser();
        if (!data.role) {
          // retry after short delay
          setTimeout(init, 1000);
        } else {
          setUser(data || initialUser);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setUser(initialUser);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isSignedIn]); // ✅ FIXED DEPENDENCY

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAppAuth = () =>useContext(AuthContext);
export { useAppAuth};