from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'obras', views.ObraViewSet)
router.register(r'usuario-obras', views.UsuarioObraViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
