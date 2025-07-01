from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Avaliacao
from .serializers import AvaliacaoSerializer, AvaliacaoCreateSerializer
from . import database_functions

class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AvaliacaoCreateSerializer
        return AvaliacaoSerializer
    
    @action(detail=False, methods=['post'])
    def submit_feedback(self, request):
        try:
            usuario_id = request.data.get('usuario_id')
            pontos_experiencia = request.data.get('pontos_experiencia')
            comentarios = request.data.get('comentarios')
            
            avaliacao_id = database_functions.submit_feedback(usuario_id, pontos_experiencia, comentarios)
            return Response({
                'status': 'success',
                'avaliacao_id': avaliacao_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def all_feedbacks(self, request):
        try:
            feedbacks = database_functions.get_all_feedbacks()
            return Response({
                'status': 'success',
                'feedbacks': feedbacks
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def user_feedbacks(self, request):
        try:
            usuario_id = request.query_params.get('usuario_id')
            if not usuario_id:
                return Response({
                    'status': 'error',
                    'message': 'Parâmetro usuario_id é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            feedbacks = database_functions.get_user_feedbacks(usuario_id)
            return Response({
                'status': 'success',
                'feedbacks': feedbacks
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def average_rating(self, request):
        try:
            avg = database_functions.get_average_rating()
            return Response({
                'status': 'success',
                'average_rating': avg
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
