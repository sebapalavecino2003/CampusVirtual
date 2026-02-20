import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { useEnrollments } from "../features/enrollments/hooks/useEnrollments";
import { tokenStorage } from "../shared/storage/tokenStorage";

export default function MyEnrollmentsPage() {
  const logged = !!tokenStorage.getAccess();
  const { items, cargando, error } = useEnrollments();

  if (!logged) return <ErrorMessage message="Tenés que loguearte para ver tus inscripciones." />;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 style={{ margin: 0 }}>Mis inscripciones</h2>

      {cargando ? <p>Cargando...</p> : <ErrorMessage message={error} />}

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((i) => (
          <Card key={i.id}>
            <div style={{ fontWeight: 600 }}>{i.curso_titulo}</div>
            <div style={{ fontSize: 13, color: "#555" }}>Estado: {i.estado}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}