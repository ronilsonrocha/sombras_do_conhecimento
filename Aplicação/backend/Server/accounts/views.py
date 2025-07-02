# accounts/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserDetailSerializer
from . import database_functions

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserDetailSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        try:
            nome = request.data.get('nome')
            email = request.data.get('email')
            senha = request.data.get('senha')
            tipo_usuario = request.data.get('tipo_usuario', 'aluno')
            
            # Usando a função create_user do database_functions
            user_id = database_functions.create_user(nome, email, senha, tipo_usuario)
            
            return Response({
                'status': 'success',
                'user_id': user_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Erro ao registrar usuário:", str(e))
            import traceback
            traceback.print_exc()
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
