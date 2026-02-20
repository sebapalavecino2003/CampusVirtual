from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Curso, Inscripcion
from .serializers import CursoSerializer, CursoCrearSerializer, InscripcionSerializer
from .permissions import SoloLecturaOProfesorOAdmin, EsAlumno


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all().order_by("-creado_en")
    permission_classes = [SoloLecturaOProfesorOAdmin]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CursoCrearSerializer
        return CursoSerializer

    @action(detail=True, methods=["post"], permission_classes=[EsAlumno])
    def unirse(self, request, pk=None):
        # 1) curso existe (get_object lo hace)
        curso = self.get_object()

        # 1b) curso activo
        if not curso.activo:
            return Response({"detail": "El curso está inactivo."}, status=400)

        # 3) alumno ya inscripto
        if Inscripcion.objects.filter(curso=curso, alumno=request.user, estado="ACTIVA").exists():
            return Response({"detail": "Ya estás inscripto."}, status=200)

        # 2) contraseña
        password = request.data.get("password_union", "")
        if not curso.check_password_union(password):
            return Response({"detail": "Contraseña incorrecta."}, status=401)

        # 4) crear inscripción
        ins = Inscripcion.objects.create(curso=curso, alumno=request.user)
        return Response(InscripcionSerializer(ins).data, status=201)


class InscripcionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InscripcionSerializer

    def get_queryset(self):
        return (
            Inscripcion.objects
            .filter(alumno=self.request.user)
            .select_related("curso")
            .order_by("-inscripto_en")
        )

    @action(detail=False, methods=["get"])
    def mias(self, request):
        qs = self.get_queryset()
        return Response(self.get_serializer(qs, many=True).data)