from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegistroSerializer, PerfilSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class TokenConRolSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["rol"] = user.rol
        token["nombre_completo"] = user.nombre_completo
        return token


class RegistroView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistroSerializer


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TokenConRolSerializer


class MiPerfilView(generics.RetrieveAPIView):
    serializer_class = PerfilSerializer

    def get_object(self):
        return self.request.user