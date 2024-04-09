from .models import Partner, Location, Contractor, Article, Task
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('name', 'partner', 'address')
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class ContractorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contractor
        fields = '__all__'
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
        

class PartnerSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)
    contractors = ContractorSerializer(many=True, read_only=True)

    class Meta:
        model = Partner
        fields = '__all__'
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        validated_data['franchiser'] = self.context['request'].user
        return super().create(validated_data)


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
        if not user:
            raise ValidationError('User not found.')
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username')


class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )
        

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'duration', 'related_ids')
        
        
class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'duration', 'related_ids')
        
