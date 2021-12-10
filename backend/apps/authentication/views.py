from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authentication.serializers import LoginSerializer, RegisterSerializer
from apps.authentication.utils import get_response_token


class AuthViewSet(ViewSet):
    permission_classes = []

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny, ])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(request, username=serializer.data['username'], password=serializer.data['password'])

        return get_response_token(user, HTTP_200_OK)

    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated, ])
    def logout(self, request):
        try:
            refresh = request.COOKIES.get('refresh_token', '')
            token = RefreshToken(refresh)
            token.blacklist()

            return Response(status=HTTP_204_NO_CONTENT)
        except TokenError:
            return Response(
                data={'message': 'Token is invalid or expired.'},
                status=HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny, ])
    def refresh(self, request):
        refresh = request.COOKIES.get('refresh_token', '')
        data = {
            'refresh': refresh
        }

        try:
            refresh = RefreshToken(refresh)
            user_id = refresh.get('user_id')
            user = get_object_or_404(User, pk=user_id)

            serializer = TokenRefreshSerializer(data=data)
            serializer.is_valid(raise_exception=True)
        except TokenError:
            return Response(
                data={'message': 'Token is invalid or expired.'},
                status=HTTP_400_BAD_REQUEST
            )

        return get_response_token(user, HTTP_200_OK)

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny, ])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return get_response_token(user, HTTP_201_CREATED)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated, ])
    def info(self, request):
        user = request.user

        return Response({'username': user.username}, HTTP_200_OK)
