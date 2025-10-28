#urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.UserViewSet.as_view({'post': 'login'}), name='login'),
    path('register/', views.UserViewSet.as_view({'post': 'register'}), name='register'),
    path('reset_password/', views.UserViewSet.as_view({'post': 'reset_password'}), name='reset_password'),
]