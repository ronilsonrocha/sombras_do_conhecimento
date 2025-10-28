# aplicacao/backend/server/feedback/serializers.py
from rest_framework import serializers
from .models import Avaliacao
from accounts.serializers import UserSerializer
from content.serializers import ObraSerializer # <-- IMPORTAÇÃO ADICIONADA

class AvaliacaoSerializer(serializers.ModelSerializer):
    # Serializers para mostrar os dados (Leitura)
    usuario = UserSerializer(read_only=True)
    obra = ObraSerializer(read_only=True) # <-- MOSTRAR A OBRA
    
    class Meta:
        model = Avaliacao
        # Adicionado 'obra' e 'pontos_experiencia'
        fields = ['id', 'comentarios', 'usuario', 'obra', 'pontos_experiencia']

class AvaliacaoCreateSerializer(serializers.ModelSerializer):
    # Campos que o frontend vai enviar (Escrita)
    usuario_id = serializers.IntegerField()
    obra_id = serializers.IntegerField() # <-- CAMPO ADICIONADO
    
    class Meta:
        model = Avaliacao
        # 'pontos_experiencia' usará o default=0 do modelo
        fields = ['comentarios', 'usuario_id', 'obra_id']
        
    def create(self, validated_data):
        # O DRF mapeia 'usuario_id' para 'usuario' e 'obra_id' para 'obra'
        return Avaliacao.objects.create(**validated_data)