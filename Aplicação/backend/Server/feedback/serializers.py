from rest_framework import serializers
from .models import Avaliacao
from accounts.serializers import UserSerializer

class AvaliacaoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    usuario_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Avaliacao
        fields = ['id', 'pontos_experiencia', 'comentarios', 'usuario', 'usuario_id']

class AvaliacaoCreateSerializer(serializers.ModelSerializer):
    usuario_id = serializers.IntegerField()
    
    class Meta:
        model = Avaliacao
        fields = ['pontos_experiencia', 'comentarios', 'usuario_id']
