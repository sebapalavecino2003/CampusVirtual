import { httpClient } from "../../../shared/http/httpClient";

export const enrollmentsApi = {
  mias() {
    return httpClient.get("/api/inscripciones/mias/");
  },
};