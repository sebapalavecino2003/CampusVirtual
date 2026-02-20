from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegistroView, LoginView, MiPerfilView

urlpatterns = [
    path("registro/", RegistroView.as_view()),
    path("login/", LoginView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("mi-perfil/", MiPerfilView.as_view()),
]