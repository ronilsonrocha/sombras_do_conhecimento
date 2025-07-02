from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
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
    def login(self, request):
        email = request.data.get('email')
        senha = request.data.get('senha')
        
        try:
            user = database_functions.authenticate_user(email, senha)
            if user:
                return Response({
                    'status': 'success',
                    'user': {
                        'id': user[0],
                        'nome': user[1],
                        'tipo_usuario': user[2]
                    }
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Credenciais inválidas'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        try:
            nome = request.data.get('nome')
            email = request.data.get('email')
            senha = request.data.get('senha')
            tipo_usuario = request.data.get('tipo_usuario', 'aluno')
            
            user_id = database_functions.create_user(nome, email, senha, tipo_usuario)
            return Response({
                'status': 'success',
                'user_id': user_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # accounts/views.py
    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        try:
            print("Dados recebidos:", request.data)  # Log para debug
            email = request.data.get('email')
            nova_senha = request.data.get('nova_senha')
            
            print(f"Email: {email}, Nova senha: {nova_senha}")  # Log para debug
            
            if not email or not nova_senha:
                return Response({
                    'status': 'error',
                    'message': 'Email e nova senha são obrigatórios'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar se a função existe
            if not hasattr(database_functions, 'reset_password'):
                print("Função reset_password não encontrada!")  # Log para debug
                return Response({
                    'status': 'error',
                    'message': 'Função reset_password não implementada'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            result = database_functions.reset_password(email, nova_senha)
            print("Resultado:", result)  # Log para debug
            
            if result:
                return Response({
                    'status': 'success',
                    'message': 'Senha redefinida com sucesso'
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Usuário não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Erro ao redefinir senha:", str(e))  # Log para debug
            import traceback
            traceback.print_exc()  # Imprime o traceback completo
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
