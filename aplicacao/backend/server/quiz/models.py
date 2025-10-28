from django.db import models
from accounts.models import User
from content.models import Obra

class Pergunta(models.Model):
    NIVEL_CHOICES = [
        ('facil', 'Fácil'),
        ('medio', 'Médio'),
        ('dificil', 'Difícil'),
    ]
    
    texto_enunciado = models.TextField()
    nivel = models.CharField(max_length=20, choices=NIVEL_CHOICES, null=True, blank=True)
    letra_correta = models.CharField(max_length=1)
    obras = models.ManyToManyField(
        Obra,
        through='PerguntaObra',
        related_name='perguntas'
    )
    usuarios = models.ManyToManyField(
        User,
        through='progress.PerguntaUsuario',
        related_name='perguntas'
    )
    
    class Meta:
        db_table = 'perguntas'
        verbose_name = 'Pergunta'
        verbose_name_plural = 'Perguntas'
    
    def __str__(self):
        return self.texto_enunciado[:50]
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.letra_correta not in ['A', 'B', 'C', 'D']:
            raise ValidationError('A letra correta deve ser A, B, C ou D.')

class Alternativa(models.Model):
    letra_alternativa = models.CharField(max_length=1)
    texto_alternativa = models.TextField()
    pergunta = models.ForeignKey(
        Pergunta, 
        on_delete=models.CASCADE, 
        related_name='alternativas',
        db_column='id_pergunta'
    )
    
    class Meta:
        db_table = 'alternativas'
        verbose_name = 'Alternativa'
        verbose_name_plural = 'Alternativas'
    
    def __str__(self):
        return f"{self.letra_alternativa}: {self.texto_alternativa[:30]}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.letra_alternativa not in ['A', 'B', 'C', 'D']:
            raise ValidationError('A letra da alternativa deve ser A, B, C ou D.')

class PerguntaObra(models.Model):
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, db_column='id_pergunta')
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, db_column='id_obra')
    
    class Meta:
        db_table = 'pergunta_obra'
        unique_together = ('pergunta', 'obra')