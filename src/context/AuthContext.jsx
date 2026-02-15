import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user info
  const [role, setRole] = useState(null); // "viewer" or "operator"

  const login = (userRole) => {
    setUser({ name: "Test User" }); // simple fake user
    setRole(userRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easier usage
export function useAuth() {
  return useContext(AuthContext);
}

