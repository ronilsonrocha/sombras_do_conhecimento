# aplicacao/backend/server/feedback/models.py
from django.db import models
from accounts.models import User
from content.models import Obra  

class Avaliacao(models.Model):
    pontos_experiencia = models.IntegerField(default=0) 
    comentarios = models.TextField(null=True, blank=True)
    usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='avaliacoes',
        db_column='id_usuario'
    )
    
    # Este é o link para o "texto escolhido"
    obra = models.ForeignKey(
        Obra, 
        on_delete=models.CASCADE, 
        related_name='avaliacoes_obra', # Nome diferente para evitar conflito
        db_column='id_obra',
        null=True, # Permite que a migração funcione
        blank=True
    )
    
    class Meta:
        db_table = 'avaliacao'
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'