from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.budget.models import Budget, SharedBudget
from apps.budget.serializers import BudgetSerializer


class BudgetViewSet(ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return Budget.objects.all()
        # user = self.request.user
        # if user.is_authenticated:
        #     return SharedBudget.objects.filter(user=user)
        # raise PermissionDenied()
