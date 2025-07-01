from django.db import models
from accounts.models import User

class Obra(models.Model):
    nome_autor = models.CharField(max_length=50)
    nome_obra = models.CharField(max_length=50)
    texto = models.TextField()
    usuarios = models.ManyToManyField(
        User,
        through='UsuarioObra',
        related_name='obras'
    )
    
    class Meta:
        db_table = 'obras'
        verbose_name = 'Obra'
        verbose_name_plural = 'Obras'
    
    def __str__(self):
        return f"{self.nome_obra} - {self.nome_autor}"

class UsuarioObra(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, db_column='id_usuario')
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')
    
    class Meta:
        db_table = 'usuario_obra'
        unique_together = ('usuario', 'obra')
