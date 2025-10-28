from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('content/', include('content.urls')),
    path('quiz/', include('quiz.urls')),
    path('progress/', include('progress.urls')),
    path('feedback/', include('feedback.urls')),
]
