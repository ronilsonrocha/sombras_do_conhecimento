from rest_framework import serializers
from .models import Pergunta, Alternativa, PerguntaObra
from content.serializers import ObraSerializer

class AlternativaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alternativa
        fields = ['id', 'letra_alternativa', 'texto_alternativa']

class PerguntaSerializer(serializers.ModelSerializer):
    alternativas = AlternativaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pergunta
        fields = ['id', 'texto_enunciado', 'nivel', 'letra_correta', 'alternativas']

class PerguntaDetailSerializer(serializers.ModelSerializer):
    alternativas = AlternativaSerializer(many=True, read_only=True)
    obras = ObraSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pergunta
        fields = ['id', 'texto_enunciado', 'nivel', 'letra_correta', 'alternativas', 'obras']

class PerguntaCreateSerializer(serializers.ModelSerializer):
    alternativas = AlternativaSerializer(many=True)
    
    class Meta:
        model = Pergunta
        fields = ['texto_enunciado', 'nivel', 'letra_correta', 'alternativas']
    
    def create(self, validated_data):
        alternativas_data = validated_data.pop('alternativas')
        pergunta = Pergunta.objects.create(**validated_data)
        
        for alternativa_data in alternativas_data:
            Alternativa.objects.create(pergunta=pergunta, **alternativa_data)
        
        return pergunta

class PerguntaObraSerializer(serializers.ModelSerializer):
    pergunta = PerguntaSerializer(read_only=True)
    obra = ObraSerializer(read_only=True)
    pergunta_id = serializers.IntegerField(write_only=True)
    obra_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = PerguntaObra
        fields = ['id', 'pergunta', 'obra', 'pergunta_id', 'obra_id']