from rest_framework import serializers
from .models import Obra, UsuarioObra
from accounts.serializers import UserSerializer

class ObraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Obra
        fields = ['id', 'nome_autor', 'nome_obra', 'texto']

class ObraDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Obra
        fields = ['id', 'nome_autor', 'nome_obra', 'texto']

class UsuarioObraSerializer(serializers.ModelSerializer):
    obra = ObraSerializer(read_only=True)
    usuario = UserSerializer(read_only=True)
    obra_id = serializers.IntegerField(write_only=True)
    usuario_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UsuarioObra
        fields = ['id', 'obra', 'usuario', 'obra_id', 'usuario_id']