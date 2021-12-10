from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authentication.serializers import LoginSerializer


class AuthViewSet(ViewSet):
    permission_classes = []

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny, ])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(request, username=serializer.data['username'], password=serializer.data['password'])

        refresh = RefreshToken.for_user(user)

        response = Response(
            data={'access': str(refresh.access_token)},
            status=HTTP_200_OK
        )
        response.set_cookie('refresh_token', str(refresh), max_age=3600 * 24, httponly=True)

        return response

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

        serializer = TokenRefreshSerializer(data=data)

        try:
            refresh = RefreshToken(refresh)
            user_id = refresh.get('user_id')
            user = get_object_or_404(User, pk=user_id)

            serializer.is_valid(raise_exception=True)
        except TokenError:
            return Response(
                data={'message': 'Token is invalid or expired.'},
                status=HTTP_400_BAD_REQUEST
            )

        refresh = RefreshToken.for_user(user)

        response = Response(
            data={'access': str(refresh.access_token)},
            status=HTTP_200_OK
        )
        response.set_cookie('refresh_token', str(refresh), max_age=3600 * 24, httponly=True)

        return response
