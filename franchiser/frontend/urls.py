from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('login/', index),
    path('register/', index),
    path('dashboard/', index),
    path('partner/<int:id>/', index),
    path('location/<int:id>/', index),
    path('news/<int:page>/', index),
    path('contractor/<int:id>/', index),
]
