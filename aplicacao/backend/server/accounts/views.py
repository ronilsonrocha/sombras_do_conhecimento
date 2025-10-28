# aplicacao/backend/server/accounts/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login 
from .models import User
from .serializers import UserSerializer, UserDetailSerializer

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
        
        user = authenticate(request, username=email, password=senha)
        
        if user is not None:
            login(request, user)
            
            tipo_usuario_final = ''
            
            if user.is_superuser or user.is_staff:
                tipo_usuario_final = User.PROFESSOR # Usa 'professor'
            else:
                tipo_usuario_final = user.tipo_usuario 
            
            return Response({
                'status': 'success',
                'user': {
                    'id': user.id,
                    'nome': user.first_name,
                    'tipo_usuario': tipo_usuario_final
                }
            })
        else:
            return Response({
                'status': 'error',
                'message': 'Credenciais inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        email = request.data.get('email')
        senha = request.data.get('senha')
        nome = request.data.get('nome') 
        tipo_usuario = request.data.get('tipo_usuario', User.ALUNO) 

        if User.objects.filter(email=email).exists():
            return Response({
                'status': 'error',
                'message': 'Este email já está cadastrado.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=email, 
                email=email,
                password=senha,
                first_name=nome,
                tipo_usuario=tipo_usuario
            )
            
            if tipo_usuario == User.PROFESSOR:
                user.is_staff = True
                user.save()

            return Response({
                'status': 'success',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        email = request.data.get('email')
        nova_senha = request.data.get('nova_senha')

        if not email or not nova_senha:
            return Response({
                'status': 'error',
                'message': 'Email e nova senha são obrigatórios'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            user.set_password(nova_senha)
            user.save()
            
            return Response({
                'status': 'success',
                'message': 'Senha redefinida com sucesso'
            })
            
        except User.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Usuário não encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)