from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)

        usuario = self.model(email=email, **extra_fields)
        usuario.set_password(password)  # guarda hash
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("rol", "ADMIN")
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ALUMNO = "ALUMNO", "Alumno"
        PROFESOR = "PROFESOR", "Profesor"
        ADMIN = "ADMIN", "Admin"

    username = None
    email = models.EmailField(unique=True)

    rol = models.CharField(max_length=10, choices=Rol.choices, default=Rol.ALUMNO)
    nombre_completo = models.CharField(max_length=150)
    creado_en = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    def __str__(self):
        return f"{self.email} ({self.rol})"