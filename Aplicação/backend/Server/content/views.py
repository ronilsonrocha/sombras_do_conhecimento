from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Obra, UsuarioObra
from .serializers import ObraSerializer, ObraDetailSerializer, UsuarioObraSerializer
from . import database_functions

class ObraViewSet(viewsets.ModelViewSet):
    queryset = Obra.objects.all()
    serializer_class = ObraSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ObraDetailSerializer
        return ObraSerializer
    
    @action(detail=False, methods=['get'])
    def sql_all(self, request):
        try:
            obras = database_functions.get_all_obras()
            return Response({
                'status': 'success',
                'obras': [
                    {
                        'id': o[0],
                        'nome_autor': o[1],
                        'nome_obra': o[2],
                        'texto': o[3]
                    } for o in obras
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
            obra = database_functions.get_obra_by_id(pk)
            if obra:
                return Response({
                    'status': 'success',
                    'obra': {
                        'id': obra[0],
                        'nome_autor': obra[1],
                        'nome_obra': obra[2],
                        'texto': obra[3]
                    }
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Obra não encontrada'
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def usuarios(self, request, pk=None):
        try:
            obra = self.get_object()
            usuarios = obra.usuarios.all()
            return Response({
                'status': 'success',
                'usuarios': UserSerializer(usuarios, many=True).data
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['put'])
    def update_obra_text(self, request):
        try:
            id = request.data.get('id')
            nome_obra = request.data.get('nome_obra')
            nome_autor = request.data.get('nome_autor')
            novo_texto = request.data.get('texto')
            
            if not nome_obra or not nome_autor or not novo_texto:
                return Response({
                    'status': 'error',
                    'message': 'Nome da obra, nome do autor e novo texto são obrigatórios'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            result = database_functions.update_obra(id, nome_obra, nome_autor, novo_texto)
            
            if result:
                return Response({
                    'status': 'success',
                    'message': 'Texto da obra atualizado com sucesso'
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Obra não encontrada ou nenhuma alteração foi feita'
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UsuarioObraViewSet(viewsets.ModelViewSet):
    queryset = UsuarioObra.objects.all()
    serializer_class = UsuarioObraSerializer
    
    @action(detail=False, methods=['post'])
    def associate(self, request):
        try:
            usuario_id = request.data.get('usuario_id')
            obra_id = request.data.get('obra_id')
            
            result = database_functions.associate_user_with_obra(usuario_id, obra_id)
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
    def by_user(self, request):
        try:
            usuario_id = request.query_params.get('usuario_id')
            if not usuario_id:
                return Response({
                    'status': 'error',
                    'message': 'Parâmetro usuario_id é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            obras = database_functions.get_obras_by_user(usuario_id)
            return Response({
                'status': 'success',
                'obras': [
                    {
                        'id': o[0],
                        'nome_autor': o[1],
                        'nome_obra': o[2],
                        'texto': o[3]
                    } for o in obras
                ]
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
