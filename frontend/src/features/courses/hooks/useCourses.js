import { useEffect, useState } from "react";
import { coursesApi } from "../api/coursesApi";

export function useCourses() {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setError("");
    setCargando(true);
    try {
      const data = await coursesApi.listar();
      setCursos(data);
    } catch (e) {
      setError(e.message || "Error cargando cursos");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  return { cursos, cargando, error, recargar: cargar };
}