# aplicacao/backend/server/quiz/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pergunta, Alternativa, PerguntaObra
from .serializers import (
    PerguntaSerializer, PerguntaDetailSerializer, 
    PerguntaCreateSerializer, 
    AlternativaReadSerializer,
    PerguntaObraSerializer
)

class PerguntaViewSet(viewsets.ModelViewSet):
    # ===== CORREÇÃO 1 DE 3 =====
    # Adicionamos .prefetch_related() para que a lista principal
    # (e a tela de detalhes) já venha com as alternativas.
    queryset = Pergunta.objects.all().prefetch_related('alternativas')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PerguntaDetailSerializer
        elif self.action == 'create':
            return PerguntaCreateSerializer
        return PerguntaSerializer

    @action(detail=False, methods=['post'])
    def sql_create(self, request):
        serializer = PerguntaCreateSerializer(data=request.data)
        if serializer.is_valid():
            pergunta = serializer.save()
            return Response({'status': 'success', 'pergunta_id': pergunta.id}, status=status.HTTP_201_CREATED)
        else:
            return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=True, methods=['get'])
    def by_obra(self, request, pk=None):
        obra_id = request.query_params.get('obra_id')
        if not obra_id:
            return Response({'status': 'error', 'message': 'Parâmetro obra_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # ===== CORREÇÃO 2 DE 3 =====
            # Adicionamos .prefetch_related()
            perguntas = Pergunta.objects.filter(obras__id=obra_id).prefetch_related('alternativas')
            
            serializer = PerguntaSerializer(perguntas, many=True)
            return Response({'status': 'success', 'perguntas': serializer.data})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='by_nivel_obra')
    def by_nivel_obra(self, request):
        nivel = request.query_params.get('nivel')
        id_obra = request.query_params.get('id_obra')
        if not nivel or not id_obra:
            return Response({"erro": "Parâmetros 'nivel' e 'id_obra' são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # ===== CORREÇÃO 3 DE 3 =====
            # Adicionamos .prefetch_related()
            perguntas = Pergunta.objects.filter(nivel=nivel, obras__id=id_obra).prefetch_related('alternativas')
            
            serializer = PerguntaSerializer(perguntas, many=True)
            return Response({'status': 'success', 'perguntas': serializer.data})
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AlternativaViewSet(viewsets.ModelViewSet):
    queryset = Alternativa.objects.all()
    serializer_class = AlternativaReadSerializer 

class PerguntaObraViewSet(viewsets.ModelViewSet):
    queryset = PerguntaObra.objects.all()
    serializer_class = PerguntaObraSerializer
    
    @action(detail=False, methods=['post'])
    def associate(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return Response({'status': 'success', 'result': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)