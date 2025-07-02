from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pergunta, Alternativa, PerguntaObra
from .serializers import (
    PerguntaSerializer, PerguntaDetailSerializer, 
    PerguntaCreateSerializer, AlternativaSerializer,
    PerguntaObraSerializer
)
from . import database_functions

class PerguntaViewSet(viewsets.ModelViewSet):
    queryset = Pergunta.objects.all()
    serializer_class = PerguntaSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PerguntaDetailSerializer
        elif self.action == 'create':
            return PerguntaCreateSerializer
        return PerguntaSerializer
    
    @action(detail=False, methods=['get'])
    def sql_all(self, request):
        try:
            perguntas = database_functions.get_all_perguntas()
            return Response({
                'status': 'success',
                'perguntas': [
                    {
                        'id': p[0],
                        'texto_enunciado': p[1],
                        'nivel': p[2],
                        'letra_correta': p[3]
                    } for p in perguntas
                ]
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def sql_detail(self, request, pk=None):
        try:
            pergunta = database_functions.get_pergunta_with_alternativas(pk)
            if pergunta:
                return Response({
                    'status': 'success',
                    'pergunta': pergunta
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Pergunta não encontrada'
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def sql_create(self, request):
        try:
            texto_enunciado = request.data.get('texto_enunciado')
            nivel = request.data.get('nivel')
            letra_correta = request.data.get('letra_correta')
            alternativas = request.data.get('alternativas', [])
            
            # Validar os dados
            if not texto_enunciado:
                return Response({
                    'status': 'error',
                    'message': 'O texto do enunciado é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not letra_correta or letra_correta not in ['A', 'B', 'C', 'D']:
                return Response({
                    'status': 'error',
                    'message': 'A letra correta deve ser A, B, C ou D'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(alternativas) < 2:
                return Response({
                    'status': 'error',
                    'message': 'É necessário fornecer pelo menos duas alternativas'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar se cada alternativa tem letra e texto
            for alt in alternativas:
                if 'letra' not in alt or 'texto' not in alt:
                    return Response({
                        'status': 'error',
                        'message': 'Cada alternativa deve ter letra e texto'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar a pergunta com alternativas
            pergunta_id = database_functions.create_pergunta_with_alternativas(
                texto_enunciado, nivel, letra_correta, alternativas
            )
            
            return Response({
                'status': 'success',
                'pergunta_id': pergunta_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Erro ao criar pergunta:", str(e))
            import traceback
            traceback.print_exc()
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    @action(detail=True, methods=['get'])
    def by_obra(self, request, pk=None):
        try:
            obra_id = request.query_params.get('obra_id')
            if not obra_id:
                return Response({
                    'status': 'error',
                    'message': 'Parâmetro obra_id é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            perguntas = database_functions.get_perguntas_by_obra(obra_id)
            return Response({
                'status': 'success',
                'perguntas': [
                    {
                        'id': p[0],
                        'texto_enunciado': p[1],
                        'nivel': p[2],
                        'letra_correta': p[3]
                    } for p in perguntas
                ]
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AlternativaViewSet(viewsets.ModelViewSet):
    queryset = Alternativa.objects.all()
    serializer_class = AlternativaSerializer

class PerguntaObraViewSet(viewsets.ModelViewSet):
    queryset = PerguntaObra.objects.all()
    serializer_class = PerguntaObraSerializer
    
    @action(detail=False, methods=['post'])
    def associate(self, request):
        try:
            pergunta_id = request.data.get('pergunta_id')
            obra_id = request.data.get('obra_id')
            
            result = database_functions.associate_pergunta_with_obra(pergunta_id, obra_id)
            return Response({
                'status': 'success',
                'result': result
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
