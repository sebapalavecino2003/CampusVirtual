import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { authApi } from "../features/auth/api/authApi";

export default function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [nombre_completo, setNombre] = useState("");
  const [rol, setRol] = useState("ALUMNO");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await authApi.registro({ email, nombre_completo, rol, password });
      nav("/login");
    } catch (e2) {
      setError(e2.message);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Registro</h2>
        <ErrorMessage message={error} />
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label>
            Nombre completo
            <Input value={nombre_completo} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label>
            Email
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Rol
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            >
              <option value="ALUMNO">Alumno</option>
              <option value="PROFESOR">Profesor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <label>
            Password
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <Button type="submit">Crear cuenta</Button>
        </form>
      </Card>
    </div>
  );
}