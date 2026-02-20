import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { tokenStorage } from "../../../shared/storage/tokenStorage";

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargarPerfil() {
    try {
      const me = await authApi.miPerfil();
      setUsuario(me);
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    const tokens = await authApi.login({ email, password });
    tokenStorage.setAccess(tokens.access);
    tokenStorage.setRefresh(tokens.refresh);
    await cargarPerfil();
  }

  function logout() {
    tokenStorage.clear();
    setUsuario(null);
  }

  return { usuario, cargando, login, logout, recargar: cargarPerfil };
}