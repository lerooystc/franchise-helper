from django.contrib.auth import login, logout
from rest_framework import viewsets, generics, status
from .pagination import ArticlePagination
import rest_framework.permissions as perms
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import *
from .models import Partner, Contractor, Location, Article, Task, Notification
from django.db.models import F
from .permissions import *


class PartnerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwner]
    queryset = Partner.objects.select_related('franchiser').prefetch_related('locations', 'contractors', 'tasks')
    serializer_class = PartnerSerializer
    
    def list(self, request):
        host = self.request.user
        queryset = self.get_queryset().filter(franchiser=host)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ContractorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwner]
    queryset = Contractor.objects.all()
    serializer_class = ContractorSerializer
    
    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        return super(self.__class__, self).get_permissions()


class AnalysisViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwner]
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    
    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [perms.IsAuthenticated, ]
        elif self.action == 'retrieve' or 'update':
            self.permission_classes = [perms.AllowAny, ]
        return super(self.__class__, self).get_permissions()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(owner=request.user)
        if partner := request.GET.get('partner'):
            queryset = queryset.filter(partner=partner) 
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
             
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.GET.get('code', 0) == instance.access_code:
            return super(AnalysisViewSet, self).retrieve(request, *args, **kwargs) 
        else: 
            return Response({"Forbidden": "Wrong access code."}, status=status.HTTP_403_FORBIDDEN) 
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.data.get('access_code') == instance.access_code:
            Notification.objects.create(franchiser=instance.owner, title="Был завершен анализ \"" + instance.title + "\".", link=f"analysis/{instance.id}")
            return super(AnalysisViewSet, self).update(request, *args, **kwargs) 
        else: 
            return Response({"Forbidden": "Wrong access code."}, status=status.HTTP_403_FORBIDDEN) 
    
    def create(self, request, format=None):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            obj = serializer.save()
            return Response({'id': obj.id, 'code': obj.access_code}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=['get'], detail=False)
    def get_templates(self, request):
        queryset = self.get_queryset().filter(owner=request.user, is_template=True)
        serializer = TemplateSerializer(queryset, many=True)
        return Response(serializer.data)
    

class LocationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwner]
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    
    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        return super(self.__class__, self).get_permissions()
    

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [perms.AllowAny]
    queryset = Article.objects.all().order_by('-date_published')
    serializer_class = ArticleSerializer
    pagination_class = ArticlePagination
    
    
class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwner]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    create_serializer_class = CreateTaskSerializer
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TaskSerializer
        else:
            return CreateTaskSerializer
    
    def list(self, request):
        host = self.request.user
        queryset = self.get_queryset().filter(franchiser=host)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, format=None):
        data = request.data
        if isinstance(data, list):
            serializer = self.get_serializer(data=data, many=True)
        else:
            serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(owner=request.user, franchiser=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
       task_id = self.get_object().local_id
       Task.objects.filter(local_id__gt=task_id).update(local_id=F('local_id')-1)
       return super(TaskViewSet, self).destroy(request, *args, **kwargs)
    
    @action(methods=['post'], detail=False)
    def bulk_save(self, request):
        update_data = { 
            i['id']: {k: v for k, v in i.items() if k != 'id'}
            for i in request.data if i.get('id')
        }
        
        post_data = [
            {k: v for k, v in i.items()}
            for i in request.data if not i.get('id')
        ]

        for inst in self.get_queryset().filter(id__in=update_data.keys()):
            serializer = self.get_serializer(inst, data=update_data[inst.id], partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        
        post_serializer = self.get_serializer(data=post_data, many=True)
        if post_serializer.is_valid():
            post_serializer.save(owner=request.user, franchiser=request.user)

        return Response([serializer.data, post_serializer.data], status=status.HTTP_201_CREATED)


class UserRegister(APIView):
    permission_classes = [perms.AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(request.data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = [perms.AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(request.data)
            if user:
                login(request, user)
                return Response({"Token": Token.objects.get_or_create(user=user)[0].key}, status=status.HTTP_200_OK)
            else:
                return Response("Not Found", status=status.HTTP_404_NOT_FOUND)


class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [perms.IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class GetNotifications(APIView):
    permission_classes = [perms.IsAuthenticated]

    def get(self, request):
        queryset = Notification.objects.filter(franchiser=request.user, seen=False).order_by('-added_on')
        if (n := queryset.count()) < 10:
            queryset = queryset | Notification.objects.filter(franchiser=request.user).order_by('-added_on')[n:11]
        serializer = NotificationSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class NotificationsChecked(APIView):
    permission_classes = [perms.IsAuthenticated]

    def patch(self, request):
        Notification.objects.filter(franchiser=request.user, seen=False).update(seen=True)
        return Response({"Acknowledged": "Notifications updated"}, status=status.HTTP_200_OK)    