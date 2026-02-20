from rest_framework import serializers
from .models import Curso, Inscripcion


class CursoSerializer(serializers.ModelSerializer):
    profesor_email = serializers.CharField(source="profesor.email", read_only=True)

    class Meta:
        model = Curso
        fields = ["id", "titulo", "descripcion", "profesor", "profesor_email", "activo", "creado_en"]
        read_only_fields = ["id", "profesor", "profesor_email", "creado_en"]


class CursoCrearSerializer(serializers.ModelSerializer):
    password_union = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Curso
        fields = ["id", "titulo", "descripcion", "activo", "password_union"]

    def create(self, validated_data):
        password = validated_data.pop("password_union", "")
        curso = Curso(**validated_data)
        curso.profesor = self.context["request"].user
        curso.set_password_union(password if password else None)
        curso.save()
        return curso


class InscripcionSerializer(serializers.ModelSerializer):
    curso_titulo = serializers.CharField(source="curso.titulo", read_only=True)

    class Meta:
        model = Inscripcion
        fields = ["id", "curso", "curso_titulo", "alumno", "inscripto_en", "estado"]
        read_only_fields = ["id", "alumno", "inscripto_en", "curso_titulo"]