from django.contrib import admin
from .models import Pergunta, Alternativa, PerguntaObra

class AlternativaInline(admin.TabularInline):
    model = Alternativa
    extra = 4

@admin.register(Pergunta)
class PerguntaAdmin(admin.ModelAdmin):
    list_display = ('texto_enunciado', 'nivel', 'letra_correta')
    list_filter = ('nivel',)
    search_fields = ('texto_enunciado',)
    inlines = [AlternativaInline]

admin.site.register(PerguntaObra)
