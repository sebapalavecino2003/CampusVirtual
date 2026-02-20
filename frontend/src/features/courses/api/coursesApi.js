import { httpClient } from "../../../shared/http/httpClient";

export const coursesApi = {
  listar() {
    return httpClient.get("/api/cursos/");
  },
  crear(payload) {
    return httpClient.post("/api/cursos/", payload);
  },
  detalle(id) {
    return httpClient.get(`/api/cursos/${id}/`);
  },
  unirse(id, payload) {
    return httpClient.post(`/api/cursos/${id}/unirse/`, payload);
  },
};