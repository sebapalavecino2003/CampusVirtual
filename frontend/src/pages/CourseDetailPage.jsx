import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { coursesApi } from "../features/courses/api/coursesApi";
import { tokenStorage } from "../shared/storage/tokenStorage";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function cargar() {
    setError("");
    try {
      const data = await coursesApi.detalle(id);
      setCurso(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function unirse() {
    setError("");
    setMsg("");
    try {
      if (!tokenStorage.getAccess()) {
        setError("Tenés que loguearte para unirte.");
        return;
      }
      await coursesApi.unirse(id, { password_union: pw });
      setMsg("Listo: te uniste al curso.");
    } catch (e) {
      setError(e.message);
    }
  }

  if (error && !curso) return <ErrorMessage message={error} />;
  if (!curso) return <p>Cargando...</p>;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Curso: {curso.titulo}</h2>

      <Card>
        <div><b>Descripción:</b> {curso.descripcion || "Sin descripción"}</div>
        <div><b>Profesor:</b> {curso.profesor_email || curso.profesor}</div>
        <div><b>Activo:</b> {curso.activo ? "Sí" : "No"}</div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Unirme</h3>
        <ErrorMessage message={error} />
        {msg && <div style={{ marginBottom: 10 }}>{msg}</div>}
        <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
          <Input placeholder="Contraseña (si tiene)" value={pw} onChange={(e) => setPw(e.target.value)} />
          <Button type="button" onClick={unirse}>Unirme</Button>
        </div>
      </Card>
    </div>
  );
}