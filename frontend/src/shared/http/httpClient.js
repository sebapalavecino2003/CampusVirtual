import { ENV } from "../config/env";
import { tokenStorage } from "../storage/tokenStorage";

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const BASE = ENV.API_BASE_URL; // <- viene de VITE_API_BASE_URL

  if (auth) {
    const access = tokenStorage.getAccess();
    if (access) headers.Authorization = `Bearer ${access}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Parse seguro (soporta 204 / vacío)
  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    // por si el backend devuelve texto
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    // muestra errores de DRF
    const message =
      (data && typeof data === "object" && data.detail) ||
      (data && typeof data === "object" ? JSON.stringify(data) : data) ||
      `Error HTTP ${res.status}`;

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
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};