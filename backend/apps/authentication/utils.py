from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


def get_response_token(user, status):
    refresh = RefreshToken.for_user(user)

    response = Response(
        data={'access': str(refresh.access_token)},
        status=status
    )
    response.set_cookie('refresh_token', str(refresh), max_age=3600 * 24, httponly=True)

    return response
