from .models import Partner, Location, Contractor, Article, Task, Analysis, Notification
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title',)
        

class TaskSerializer(serializers.ModelSerializer):
    parents = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Task
        fields = ('id', 'local_id', 'title', 'duration', 'parents')
        
        
class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('local_id', 'title', 'duration', 'parents')
        

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = ('id', 'partner', 'criteria', 'added_on', 'cases', 'finished', 'access_code')
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'name', 'partner', 'address')
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class ContractorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contractor
        fields = ('id', 'name', 'partner',)
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
        

class PartnerSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)
    contractors = ContractorSerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, required=False)
    
    class Meta:
        model = Partner
        fields = ('id', 'name', 'city', 'gantt_created', 'starting_date', 'locations', 'contractors', 'tasks')
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        validated_data['franchiser'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        tasks = validated_data.pop('tasks', [])
        instance = super(PartnerSerializer, self).update(instance, validated_data)
        tasks_obj = []
        for task_data in tasks:
            task = Task.objects.get(**task_data)
            tasks_obj.append(task)
        instance.tasks.set(tasks_obj)
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user_obj = User.objects.create_user(email=validated_data['email'], username=validated_data['username'],
                                            password=validated_data['password'])
        user_obj.save()
        token = Token.objects.create(user=user_obj)
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(username=validated_data['username'], password=validated_data['password'])
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username')


class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )
        


        
