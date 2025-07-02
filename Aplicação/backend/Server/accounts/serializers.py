# accounts/serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(write_only=True)  # Campo temporário para receber o nome
    senha = serializers.CharField(write_only=True)  # Campo temporário para receber a senha
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nome', 'senha', 'tipo_usuario']
    
    def create(self, validated_data):
        # Extrair nome e senha dos dados validados
        nome = validated_data.pop('nome', '')
        senha = validated_data.pop('senha', '')
        
        # Usar o nome como username se não for fornecido
        if 'username' not in validated_data:
            validated_data['username'] = validated_data.get('email', '').split('@')[0]
        
        # Criar o usuário
        user = User.objects.create_user(
            **validated_data,
            password=senha,
            first_name=nome  # Armazenar o nome no campo first_name
        )
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    nome = serializers.SerializerMethodField()  # Campo virtual para retornar o nome
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nome', 'tipo_usuario', 'date_joined']
        read_only_fields = ['date_joined']
    
    def get_nome(self, obj):
        # Retornar o first_name como nome
        return obj.first_name
