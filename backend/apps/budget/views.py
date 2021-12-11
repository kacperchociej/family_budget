from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.viewsets import ModelViewSet

from apps.authentication.utils import get_shared_users, get_budgets_shared_with_me
from apps.budget.filters import BudgetFilter, SharedBudgetFilter
from apps.budget.models import Budget, SharedBudget
from apps.budget.serializers import BudgetSerializer, GrantBudgetAccessSerializer, SharedBudgetSerializer


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class BudgetViewSet(ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = BudgetFilter
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Budget.objects.filter(user=user)
        raise PermissionDenied()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['POST'])
    def share(self, request, pk=None):
        shared_by = request.user
        budget = self.get_object()

        shared_budget_serializer = GrantBudgetAccessSerializer(data=request.data)
        shared_budget_serializer.is_valid(raise_exception=True)
        shared_budget_serializer.save(
            budget=budget,
            shared_by=shared_by
        )

        return Response(
            data=get_shared_users(budget),
            status=HTTP_201_CREATED
        )

    @action(detail=False, methods=['DELETE'], url_path='revoke/(?P<access_id>[\w\-]+)')
    def revoke(self, request, access_id=None):
        user = request.user
        shared_budget = get_object_or_404(SharedBudget, pk=access_id)
        if user != shared_budget.shared_by:
            raise PermissionDenied()
        shared_budget.delete()

        return Response(status=HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['GET'])
    def shared(self, request, pk=None):
        budget = self.get_object()

        return Response(
            data={'users': get_shared_users(budget)},
            status=HTTP_200_OK
        )

    @action(detail=False, methods=['GET'], url_path='shared/me')
    def shared_with_me(self, request):
        user = request.user
        shared_with_me = get_budgets_shared_with_me(user)
        shared_budget_filter = SharedBudgetFilter(request.GET, shared_with_me)
        queryset = shared_budget_filter.qs

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = SharedBudgetSerializer(page, many=True)

            return self.get_paginated_response(serializer.data)

        serializer = SharedBudgetSerializer(queryset, many=True)

        return Response(
            data=serializer.data,
            status=HTTP_200_OK
        )
