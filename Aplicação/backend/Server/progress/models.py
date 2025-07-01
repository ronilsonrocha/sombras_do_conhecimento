from django.db import models
from accounts.models import User
from quiz.models import Pergunta

class PerguntaUsuario(models.Model):
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, db_column='id_pergunta')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, db_column='id_usuario')
    resposta_usuario = models.CharField(max_length=1, null=True, blank=True)
    
    class Meta:
        db_table = 'pergunta_usuario'
        unique_together = ('pergunta', 'usuario')
    
    @property
    def esta_correta(self):
        return self.resposta_usuario == self.pergunta.letra_correta
