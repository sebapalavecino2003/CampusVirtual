from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/cuentas/", include("accounts.urls")),
    path("api/", include("courses.urls")),
]