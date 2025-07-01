from rest_framework import serializers
from .models import PerguntaUsuario
from accounts.serializers import UserSerializer
from quiz.serializers import PerguntaSerializer

class PerguntaUsuarioSerializer(serializers.ModelSerializer):
    pergunta = PerguntaSerializer(read_only=True)
    usuario = UserSerializer(read_only=True)
    pergunta_id = serializers.IntegerField(write_only=True)
    usuario_id = serializers.IntegerField(write_only=True)
    esta_correta = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = PerguntaUsuario
        fields = ['id', 'pergunta', 'usuario', 'resposta_usuario', 'esta_correta', 'pergunta_id', 'usuario_id']

class ProgressoUsuarioSerializer(serializers.Serializer):
    total_respondidas = serializers.IntegerField()
    total_corretas = serializers.IntegerField()
    percentual_acerto = serializers.FloatField()
    respostas = PerguntaUsuarioSerializer(many=True)