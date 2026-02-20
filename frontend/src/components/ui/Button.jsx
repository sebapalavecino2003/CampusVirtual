export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: "white",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}