import { httpClient } from "../../../shared/http/httpClient";

export const authApi = {
  async registro(payload) {
    return httpClient.post("/api/cuentas/registro/", payload, { auth: false });
  },
  async login(payload) {
    return httpClient.post("/api/cuentas/login/", payload, { auth: false });
  },
  async refresh(payload) {
    return httpClient.post("/api/cuentas/refresh/", payload, { auth: false });
  },
  async miPerfil() {
    return httpClient.get("/api/cuentas/mi-perfil/");
  },
};