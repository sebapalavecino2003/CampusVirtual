from rest_framework.permissions import BasePermission, SAFE_METHODS


class EsProfesorOAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol in ["PROFESOR", "ADMIN"]


class EsAlumno(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == "ALUMNO"


class SoloLecturaOProfesorOAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.rol in ["PROFESOR", "ADMIN"]