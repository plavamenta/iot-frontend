import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [role, setRole] = useState("viewer");
  const { login } = useAuth();

  return (
    <div className="login-wrapper">
    <div className="login-blob blob-tl"></div>
    <div className="login-blob blob-tr"></div>
    <div className="login-blob blob-bl"></div>
    <div className="login-blob blob-br"></div>
      <div className="card">
        <h2>Razvrstavanje otpada</h2>
        <p>Prijavite se da biste upravljali sistemom</p>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="viewer">Posmatrač</option>
          <option value="operator">Administrator</option>
        </select>

        <button onClick={() => login(role)}>Ulogujte se</button>
      </div>
    </div>
  );
}