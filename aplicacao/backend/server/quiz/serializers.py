# aplicacao/backend/server/quiz/serializers.py
from rest_framework import serializers
from .models import Pergunta, Alternativa, PerguntaObra
from content.serializers import ObraSerializer

# =================================================================
# ETAPA 1: Serializer de LEITURA de Alternativa (CORRIGIDO)
# Traduz os nomes do banco (letra_alternativa)
# para os nomes que o React espera (letra).
# =================================================================
class AlternativaReadSerializer(serializers.ModelSerializer):
    # Traduz 'letra_alternativa' (do banco) -> 'letra' (para o React)
    letra = serializers.CharField(source='letra_alternativa')
    
    # Traduz 'texto_alternativa' (do banco) -> 'texto' (para o React)
    texto = serializers.CharField(source='texto_alternativa')

    class Meta:
        model = Alternativa
        fields = ['id', 'letra', 'texto'] # Envia os campos que o React espera


# =================================================================
# ETAPA 2: Serializer de ESCRITA de Alternativa (Correto)
# Traduz os nomes do React (letra)
# para os nomes do banco (letra_alternativa).
# =================================================================
class AlternativaWriteSerializer(serializers.Serializer):
    letra = serializers.CharField(max_length=1)
    texto = serializers.CharField()


# =================================================================
# ETAPA 3: Serializers de Pergunta (Já estão corretos)
# =================================================================

class PerguntaSerializer(serializers.ModelSerializer):
    # Usa o serializer de LEITURA (Corrigido)
    alternativas = AlternativaReadSerializer(many=True, read_only=True)
    class Meta:
        model = Pergunta
        fields = ['id', 'texto_enunciado', 'nivel', 'letra_correta', 'alternativas']

class PerguntaDetailSerializer(serializers.ModelSerializer):
    # Usa o serializer de LEITURA (Corrigido)
    alternativas = AlternativaReadSerializer(many=True, read_only=True)
    obras = ObraSerializer(many=True, read_only=True)
    class Meta:
        model = Pergunta
        fields = ['id', 'texto_enunciado', 'nivel', 'letra_correta', 'alternativas', 'obras']

class PerguntaCreateSerializer(serializers.ModelSerializer):
    # Usa o serializer de ESCRITA
    alternativas = AlternativaWriteSerializer(many=True)
    
    class Meta:
        model = Pergunta
        fields = ['texto_enunciado', 'nivel', 'letra_correta', 'alternativas']
    
    def create(self, validated_data):
        alternativas_data = validated_data.pop('alternativas')
        pergunta = Pergunta.objects.create(**validated_data)
        
        for alternativa_data in alternativas_data:
            Alternativa.objects.create(
                pergunta=pergunta,
                letra_alternativa=alternativa_data['letra'], # Mapeia 'letra'
                texto_alternativa=alternativa_data['texto']  # Mapeia 'texto'
            )
        return pergunta

class PerguntaObraSerializer(serializers.ModelSerializer):
    pergunta = PerguntaSerializer(read_only=True)
    obra = ObraSerializer(read_only=True)
    pergunta_id = serializers.IntegerField(write_only=True)
    obra_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = PerguntaObra
        fields = ['id', 'pergunta', 'obra', 'pergunta_id', 'obra_id']

    def create(self, validated_data):
        pergunta_id = validated_data.pop('pergunta_id')
        obra_id = validated_data.pop('obra_id')
        pergunta_obra = PerguntaObra.objects.create(
            pergunta_id=pergunta_id,
            obra_id=obra_id,
            **validated_data
        )
        return pergunta_obra