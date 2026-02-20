from django.conf import settings
from django.db import models
from django.contrib.auth.hashers import make_password, check_password

Usuario = settings.AUTH_USER_MODEL  # 👈 referencia al user custom (string "accounts.Usuario")


class Curso(models.Model):
    """
    Tabla: courses
    - titulo
    - descripcion
    - profesor (FK a Usuario)
    - password_union_hash (hash, NO texto plano)
    - activo
    - creado_en
    """
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)

    profesor = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        related_name="cursos_creados"
    )

    password_union_hash = models.CharField(max_length=255, blank=True, null=True)

    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def set_password_union(self, raw_password: str | None):
        self.password_union_hash = make_password(raw_password) if raw_password else None

    def check_password_union(self, raw_password: str) -> bool:
        if not self.password_union_hash:
            return True
        return check_password(raw_password, self.password_union_hash)

    def __str__(self):
        return self.titulo


class Inscripcion(models.Model):
    """
    Tabla puente: enrollments (inscripciones)
    - curso_id (FK)
    - alumno_id (FK)
    - unique(curso, alumno)
    """
    class Estado(models.TextChoices):
        ACTIVA = "ACTIVA", "Activa"
        BAJA = "BAJA", "Baja"

    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name="inscripciones"
    )

    alumno = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="inscripciones"
    )

    inscripto_en = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=10, choices=Estado.choices, default=Estado.ACTIVA)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["curso", "alumno"], name="uniq_curso_alumno"),
        ]

    def __str__(self):
        return f"{self.alumno} -> {self.curso} ({self.estado})"