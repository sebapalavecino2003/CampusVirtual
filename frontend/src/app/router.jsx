import { createBrowserRouter, Navigate } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";

import { AuthLayout } from "../components/layout/AuthLayout";
import { AppLayout } from "../components/layout/AppLayout";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CoursesListPage from "../pages/CoursesListPage";
import MyEnrollmentsPage from "../pages/MyEnrollmentsPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },

  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/registro",
    element: (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    ),
  },
  
  {
    path: "/cursos",
    element: (
      <RutaProtegida>
        <AppLayout>
          <CoursesListPage />
        </AppLayout>
      </RutaProtegida>
    ),
  },

  {
    path: "/mis-inscripciones",
    element: (
      <RutaProtegida>
        <AppLayout>
          <MyEnrollmentsPage />
        </AppLayout>
      </RutaProtegida>
    ),
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);