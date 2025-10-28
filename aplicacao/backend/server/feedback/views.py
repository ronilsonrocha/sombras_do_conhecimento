# aplicacao/backend/server/feedback/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import AvaliacaoSerializer, AvaliacaoCreateSerializer
from .models import Avaliacao
from django.db.models import Avg

# O 'database_functions' foi removido

class AvaliacaoViewSet(viewsets.ModelViewSet):
    # O ModelViewSet já lida com POST (create)
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    
    # Esta função diz ao 'create' para usar o serializer correto
    def get_serializer_class(self):
        if self.action == 'create':
            return AvaliacaoCreateSerializer
        return AvaliacaoSerializer
    
    # Rota reescrita para usar o ORM
    @action(detail=False, methods=['get'])
    def all_feedbacks(self, request):
        try:
            feedbacks = Avaliacao.objects.all()
            serializer = AvaliacaoSerializer(feedbacks, many=True)
            return Response({'status': 'success', 'feedbacks': serializer.data})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Rota reescrita para usar o ORM
    @action(detail=False, methods=['get'])
    def user_feedbacks(self, request):
        try:
            usuario_id = request.query_params.get('usuario_id')
            if not usuario_id:
                return Response({'status': 'error', 'message': 'Parâmetro usuario_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
            
            feedbacks = Avaliacao.objects.filter(usuario_id=usuario_id)
            serializer = AvaliacaoSerializer(feedbacks, many=True)
            return Response({'status': 'success', 'feedbacks': serializer.data})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Rota reescrita para usar o ORM
    @action(detail=False, methods=['get'])
    def average_rating(self, request):
        try:
            avg_data = Avaliacao.objects.all().aggregate(average_rating=Avg('pontos_experiencia'))
            return Response({'status': 'success', 'average_rating': avg_data['average_rating']})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)