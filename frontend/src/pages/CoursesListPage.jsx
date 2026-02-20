import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";

import { authApi } from "../features/auth/api/authApi";
import { coursesApi } from "../features/courses/api/coursesApi";
import { enrollmentsApi } from "../features/enrollments/api/enrollmentsApi";

export default function CoursesListPage() {
  const [perfil, setPerfil] = useState(null);

  const [cursos, setCursos] = useState([]);
  const [misInscripciones, setMisInscripciones] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Crear curso (solo profesor/admin)
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [password_union, setPasswordUnion] = useState("");
  const [crearError, setCrearError] = useState("");
  const [crearOk, setCrearOk] = useState("");

  // Unirse (solo alumno)
  const [joinPasswordByCourse, setJoinPasswordByCourse] = useState({});
  const [joinMsg, setJoinMsg] = useState("");
  const [joinError, setJoinError] = useState("");

  const esProfesorOAdmin = perfil && (perfil.rol === "PROFESOR" || perfil.rol === "ADMIN");
  const esAlumno = perfil && perfil.rol === "ALUMNO";

  async function cargarTodo() {
    setError("");
    setCargando(true);
    try {
      const [me, listaCursos, mias] = await Promise.all([
        authApi.miPerfil(),
        coursesApi.listar(),
        enrollmentsApi.mias(),
      ]);

      setPerfil(me);
      setCursos(Array.isArray(listaCursos) ? listaCursos : []);
      setMisInscripciones(Array.isArray(mias) ? mias : []);
    } catch (e) {
      setError(e.message || "Error cargando datos");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  const misCursoIds = useMemo(() => {
    return new Set(misInscripciones.map((i) => i.curso));
  }, [misInscripciones]);

  const cursosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return cursos;

    return cursos.filter((c) => {
      const t = (c.titulo || "").toLowerCase();
      const d = (c.descripcion || "").toLowerCase();
      return t.includes(q) || d.includes(q);
    });
  }, [cursos, busqueda]);

  const misCursos = useMemo(() => {
    return cursosFiltrados.filter((c) => misCursoIds.has(c.id));
  }, [cursosFiltrados, misCursoIds]);

  const cursosDisponibles = useMemo(() => {
    return cursosFiltrados.filter((c) => !misCursoIds.has(c.id));
  }, [cursosFiltrados, misCursoIds]);

  async function crearCurso() {
    setCrearError("");
    setCrearOk("");
    setJoinMsg("");
    setJoinError("");

    try {
      if (!esProfesorOAdmin) {
        setCrearError("Solo PROFESOR o ADMIN puede crear cursos.");
        return;
      }

      if (!titulo.trim()) {
        setCrearError("El título es obligatorio.");
        return;
      }

      await coursesApi.crear({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        activo: true,
        password_union: password_union.trim() || "",
      });

      setTitulo("");
      setDescripcion("");
      setPasswordUnion("");
      setCrearOk("Curso creado ✅");
      await cargarTodo();
    } catch (e) {
      setCrearError(e.message || "Error creando curso");
    }
  }

  function setJoinPassword(courseId, value) {
    setJoinPasswordByCourse((prev) => ({ ...prev, [courseId]: value }));
  }

  async function unirseACurso(courseId) {
    setJoinMsg("");
    setJoinError("");
    setCrearError("");
    setCrearOk("");

    try {
      if (!esAlumno) {
        setJoinError("Solo un ALUMNO puede unirse a cursos desde acá.");
        return;
      }

      const pw = (joinPasswordByCourse[courseId] || "").trim();

      await coursesApi.unirse(courseId, { password_union: pw });

      setJoinMsg("Te uniste al curso ✅");
      setJoinPassword(courseId, "");
      await cargarTodo();
    } catch (e) {
      setJoinError(e.message || "Error al unirse");
    }
  }

  if (cargando) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Cursos</h2>
          {perfil && (
            <div style={{ fontSize: 13, color: "#666" }}>
              {perfil.nombre_completo} — <b>{perfil.rol}</b>
            </div>
          )}
        </div>

        <div style={{ width: 320 }}>
          <Input
            placeholder="Buscar curso por título o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Crear curso */}
      {esProfesorOAdmin && (
        <Card>
          <h3 style={{ marginTop: 0 }}>Crear curso</h3>

          <ErrorMessage message={crearError} />
          {crearOk && <div style={{ marginBottom: 10 }}>{crearOk}</div>}

          <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
            <Input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <Input
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <Input
              placeholder="Contraseña de unión (opcional)"
              value={password_union}
              onChange={(e) => setPasswordUnion(e.target.value)}
            />
            <Button type="button" onClick={crearCurso}>
              Crear
            </Button>
          </div>
        </Card>
      )}

      {/* Unirse mensajes */}
      {esAlumno && (
        <>
          <ErrorMessage message={joinError} />
          {joinMsg && <div style={{ marginBottom: 6 }}>{joinMsg}</div>}
        </>
      )}

      {/* Mis cursos */}
      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: "6px 0 0" }}>Mis cursos</h3>

        {misCursos.length === 0 ? (
          <Card>No estás inscripto en ningún curso (todavía).</Card>
        ) : (
          misCursos.map((c) => (
            <Card key={c.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.titulo}</div>
                  <div style={{ fontSize: 13, color: "#555" }}>{c.descripcion || "Sin descripción"}</div>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
                    Profesor: {c.profesor_email || c.profesor}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#1a7f37" }}>
                  Inscripto ✅
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Cursos disponibles */}
      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: "6px 0 0" }}>Cursos disponibles</h3>

        {cursosDisponibles.length === 0 ? (
          <Card>No hay cursos disponibles con esa búsqueda.</Card>
        ) : (
          cursosDisponibles.map((c) => (
            <Card key={c.id}>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.titulo}</div>
                    <div style={{ fontSize: 13, color: "#555" }}>{c.descripcion || "Sin descripción"}</div>
                    <div style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
                      Profesor: {c.profesor_email || c.profesor}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: "#666" }}>
                    ID: {c.id}
                  </div>
                </div>

                {/* Unirse solo alumno */}
                {esAlumno ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 520 }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        placeholder="Contraseña (si tiene)"
                        value={joinPasswordByCourse[c.id] || ""}
                        onChange={(e) => setJoinPassword(c.id, e.target.value)}
                      />
                    </div>
                    <Button type="button" onClick={() => unirseACurso(c.id)}>
                      Unirme
                    </Button>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Para unirte necesitás rol ALUMNO.
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}