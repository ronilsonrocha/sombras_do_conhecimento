from django.contrib import admin
from .models import Obra, UsuarioObra

@admin.register(Obra)
class ObraAdmin(admin.ModelAdmin):
    list_display = ('nome_obra', 'nome_autor')
    search_fields = ('nome_obra', 'nome_autor')

admin.site.register(UsuarioObra)
