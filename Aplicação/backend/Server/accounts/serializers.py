from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nome', 'tipo_usuario']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nome=validated_data.get('nome', ''),
            tipo_usuario=validated_data.get('tipo_usuario', 'aluno')
        )
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nome', 'tipo_usuario', 'date_joined']
        read_only_fields = ['date_joined']
