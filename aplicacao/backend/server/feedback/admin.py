from django.contrib import admin
from .models import Avaliacao

@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'pontos_experiencia')
    list_filter = ('pontos_experiencia',)
