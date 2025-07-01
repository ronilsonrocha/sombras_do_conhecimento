from django.contrib import admin
from .models import PerguntaUsuario

@admin.register(PerguntaUsuario)
class PerguntaUsuarioAdmin(admin.ModelAdmin):
    list_display = ('pergunta', 'usuario', 'resposta_usuario', 'esta_correta')
    list_filter = ('usuario',)
