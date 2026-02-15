import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [role, setRole] = useState("viewer");
  const { login } = useAuth();

  return (
    <div className="login-wrapper">
      <div className="card" style={{ width: 320 }}>
        <h2>IoT System</h2>
        <p style={{ color: "var(--muted)" }}>Select your role</p>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "rgba(238, 23, 144, 0.06)",
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          <option value="viewer">Viewer</option>
          <option value="operator">Operator</option>
        </select>

        <button style={{ width: "100%" }} onClick={() => login(role)}>
          Login
        </button>
      </div>
    </div>
  );
}
