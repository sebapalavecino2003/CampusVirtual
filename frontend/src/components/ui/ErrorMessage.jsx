export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ffd1d1",
        background: "#fff5f5",
        marginBottom: 12,
      }}
    >
      {message}
    </div>
  );
}