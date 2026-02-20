from rest_framework.routers import DefaultRouter
from .views import CursoViewSet, InscripcionViewSet

router = DefaultRouter()
router.register(r"cursos", CursoViewSet, basename="cursos")
router.register(r"inscripciones", InscripcionViewSet, basename="inscripciones")

urlpatterns = router.urls