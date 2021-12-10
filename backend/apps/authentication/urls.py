from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.authentication.views import AuthViewSet

router = DefaultRouter()
router.register('', AuthViewSet, basename='authentication')

urlpatterns = [
    # path('login', TokenObtainPairView.as_view(), name='login'),
    # path('refresh', TokenRefreshView.as_view(), name='refresh'),
]
urlpatterns += router.urls
