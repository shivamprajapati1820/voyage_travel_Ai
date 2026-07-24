import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, hydrate auth state from localStorage so refreshes
  // don't log the user out.
  useEffect(() => {
    const storedUser = localStorage.getItem("voyage_user");
    const storedToken = localStorage.getItem("voyage_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = ({ user: newUser, token }) => {
    localStorage.setItem("voyage_token", token);
    localStorage.setItem("voyage_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const register = async (payload) => {
    const result = await authService.register(payload);
    persistSession(result);
    return result;
  };

  const login = async (payload) => {
    const result = await authService.login(payload);
    persistSession(result);
    return result;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors on logout - we clear local state regardless.
    } finally {
      localStorage.removeItem("voyage_token");
      localStorage.removeItem("voyage_user");
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("voyage_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
