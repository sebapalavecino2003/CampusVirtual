from django.contrib.auth import authenticate
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegistroSerializer, PerfilSerializer


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Credenciales inválidas.")

        attrs["user"] = user
        return attrs


class RegistroView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistroSerializer


class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        s = self.get_serializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = s.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        refresh["rol"] = user.rol
        refresh["nombre_completo"] = user.nombre_completo

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


class MiPerfilView(generics.RetrieveAPIView):
    serializer_class = PerfilSerializer

    def get_object(self):
        return self.request.user