from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ALUNO = 'aluno'
    PROFESSOR = 'professor'
    TIPO_USUARIO_CHOICES = [
        (ALUNO, 'Aluno'),
        (PROFESSOR, 'Professor'),
    ]
    
    tipo_usuario = models.CharField(
        max_length=50,
        choices=TIPO_USUARIO_CHOICES,
        default=ALUNO
    )
    
    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
