from django.db.models import F
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.budget.models import SharedBudget


def get_response_token(user, status):
    refresh = RefreshToken.for_user(user)

    response = Response(
        data={'access': str(refresh.access_token)},
        status=status
    )
    response.set_cookie('refresh_token', str(refresh), max_age=3600 * 24, httponly=True)

    return response


def get_shared_users(budget):
    queryset = SharedBudget.objects.filter(budget=budget)
    queryset = queryset.annotate(access_id=F('pk'), username=F('user__username'))
    return list(queryset.values('access_id', 'user_id', 'username'))


def get_budgets_shared_with_me(user):
    return SharedBudget.objects.filter(user=user)
