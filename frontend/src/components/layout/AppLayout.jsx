import { Navbar } from "./Navbar";

export function AppLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        {children}
      </main>
    </div>
  );
}