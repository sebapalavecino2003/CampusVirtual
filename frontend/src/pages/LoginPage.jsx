import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { authApi } from "../features/auth/api/authApi";
import { tokenStorage } from "../shared/storage/tokenStorage";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const tokens = await authApi.login({ email, password });

      // 👇 log para ver si llega bien
      console.log("LOGIN OK tokens:", tokens);

      // guardar tokens
      tokenStorage.setAccess(tokens.access);
      tokenStorage.setRefresh(tokens.refresh);

      // 👇 log para confirmar guardado
      console.log("ACCESS guardado:", tokenStorage.getAccess());

      // navegar a cursos
      nav("/cursos", { replace: true });

      // 🔥 backup (por si el router no refresca)
      // window.location.href = "/cursos";
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error en login");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <ErrorMessage message={error} />
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label>
            Email
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@mail.com" />
          </label>
          <label>
            Password
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </div>
  );
}