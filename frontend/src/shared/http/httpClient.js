import { ENV } from "../config/env";
import { tokenStorage } from "../storage/tokenStorage";

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const access = tokenStorage.getAccess();
    if (access) headers.Authorization = `Bearer ${access}`;
  }

  const res = await fetch(`${ENV.API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // si es JSON, lo parseamos
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;
  if (!res.ok) {
  // intenta mostrar errores de validación de DRF
  let message =
    data?.detail ||
    (data && typeof data === "object" ? JSON.stringify(data) : null) ||
    "Error en la petición";

  const error = new Error(message);
  error.status = res.status;
  error.data = data;
  throw error;
}
  return data;
}

export const httpClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
};