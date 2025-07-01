from django.db import models
from accounts.models import User

class Avaliacao(models.Model):
    pontos_experiencia = models.IntegerField()
    comentarios = models.TextField(null=True, blank=True)
    usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='avaliacoes',
        db_column='id_usuario'
    )
    
    class Meta:
        db_table = 'avaliacao'
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'