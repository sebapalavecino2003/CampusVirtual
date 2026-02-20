import { Link, useNavigate } from "react-router-dom";
import { tokenStorage } from "../../shared/storage/tokenStorage";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header style={{ background: "white", borderBottom: "1px solid #eee" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, display: "flex", gap: 12 }}>
        <Link to="/cursos" style={{ textDecoration: "none" }}>Cursos</Link>
        <Link to="/mis-inscripciones" style={{ textDecoration: "none" }}>Mis inscripciones</Link>

        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={() => {
              tokenStorage.clear();
              navigate("/login");
            }}
            style={{
              border: "1px solid #ddd",
              background: "white",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}