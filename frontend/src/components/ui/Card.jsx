export function Card({ children }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 14,
        padding: 16,
        background: "white",
      }}
    >
      {children}
    </div>
  );
}