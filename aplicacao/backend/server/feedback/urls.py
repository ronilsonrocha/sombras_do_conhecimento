from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'avaliacoes', views.AvaliacaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
