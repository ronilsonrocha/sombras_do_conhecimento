from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'perguntas', views.PerguntaViewSet)
router.register(r'alternativas', views.AlternativaViewSet)
router.register(r'pergunta-obras', views.PerguntaObraViewSet)

urlpatterns = [
    path('', include(router.urls)),
]