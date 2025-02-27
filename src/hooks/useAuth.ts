import { useRouter } from "next/navigation";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/user";

interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
}

export const useAuth = () => {
  const router = useRouter();
  const cookies = parseCookies();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    destroyCookie(undefined, "token");
    setUser(null);
    router.push("/signin");
  }, [router]);

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Token format invalid: ", error);
      return true;
    }
  };

  const loadUserData = useCallback(async () => {
    try {
      const { token } = parseCookies();

      if (!token || isTokenExpired(token)) {
        console.warn("Token expired or invalid. Signing out.");
        signOut();
        return;
      }
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.sub;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const userData = await response.json();

          if (!userData.isConfirmed) {
            console.warn("User is not confirmed. Signing out.");
            signOut();
            return;
          }
          setUser(userData);
        } else {
          signOut();
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      signOut();
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    if (cookies.token) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [cookies.token, loadUserData]);

  const signIn = async (token: string) => {
    setCookie(undefined, "token", token, {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    await loadUserData();
  };

  const isAuthenticated = !!cookies.token;

  const isConfirmed = user?.isConfirmed ?? false;

  return { user, loading, isAuthenticated, isConfirmed, signIn, signOut };
};
