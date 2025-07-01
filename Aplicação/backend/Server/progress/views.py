from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PerguntaUsuario
from .serializers import PerguntaUsuarioSerializer, ProgressoUsuarioSerializer
from . import database_functions

class PerguntaUsuarioViewSet(viewsets.ModelViewSet):
    queryset = PerguntaUsuario.objects.all()
    serializer_class = PerguntaUsuarioSerializer
    
    @action(detail=False, methods=['post'])
    def register_response(self, request):
        try:
            usuario_id = request.data.get('usuario_id')
            pergunta_id = request.data.get('pergunta_id')
            resposta = request.data.get('resposta')
            
            result = database_functions.register_user_response(usuario_id, pergunta_id, resposta)
            return Response({
                'status': 'success',
                'result': result
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def user_progress(self, request):
        try:
            usuario_id = request.query_params.get('usuario_id')
            if not usuario_id:
                return Response({
                    'status': 'error',
                    'message': 'Parâmetro usuario_id é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            progress = database_functions.get_user_progress(usuario_id)
            serializer = ProgressoUsuarioSerializer(progress)
            return Response({
                'status': 'success',
                'progress': serializer.data
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def user_progress_by_obra(self, request):
        try:
            usuario_id = request.query_params.get('usuario_id')
            obra_id = request.query_params.get('obra_id')
            
            if not usuario_id or not obra_id:
                return Response({
                    'status': 'error',
                    'message': 'Parâmetros usuario_id e obra_id são obrigatórios'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            progress = database_functions.get_user_progress_by_obra(usuario_id, obra_id)
            serializer = ProgressoUsuarioSerializer(progress)
            return Response({
                'status': 'success',
                'progress': serializer.data
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
