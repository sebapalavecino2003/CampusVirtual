import { Link } from "react-router-dom";

export function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <header style={{ background: "white", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, display: "flex", gap: 12 }}>
          <Link to="/login" style={{ textDecoration: "none" }}>Login</Link>
          <Link to="/registro" style={{ textDecoration: "none" }}>Registro</Link>
        </div>
      </header>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        {children}
      </main>
    </div>
  );
}