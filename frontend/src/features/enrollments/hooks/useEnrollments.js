import { useEffect, useState } from "react";
import { enrollmentsApi } from "../api/enrollmentsApi";

export function useEnrollments() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setError("");
    setCargando(true);
    try {
      const data = await enrollmentsApi.mias();
      setItems(data);
    } catch (e) {
      setError(e.message || "Error cargando inscripciones");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  return { items, cargando, error, recargar: cargar };
}