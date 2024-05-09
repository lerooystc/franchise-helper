from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'contractors', ContractorViewSet, basename='contractor')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'analyses', AnalysisViewSet, basename='analysis')


urlpatterns = [
    path('', include(router.urls)),
    path('logout/', UserLogout.as_view(), name='logout'),
    path('login/', UserLogin.as_view(), name='login'),
    path('register/', UserRegister.as_view(), name='register'),
    path('user/', UserView.as_view(), name='user'),
    path('notifications/', GetNotifications.as_view(), name='notifications'),
    path('notifications_checked/', NotificationsChecked.as_view(), name='notifications_checked'),
]
