from django_filters import NumberFilter, FilterSet, CharFilter

from apps.budget.models import Budget, SharedBudget


class BudgetFilter(FilterSet):
    month = CharFilter(field_name='month', lookup_expr='iexact')

    class Meta:
        model = Budget
        fields = ['month', 'year']


class SharedBudgetFilter(FilterSet):
    username = CharFilter(field_name='shared_by__username', lookup_expr='iexact')
    month = CharFilter(field_name='budget__month', lookup_expr='iexact')
    year = NumberFilter(field_name='budget__year', lookup_expr='exact')

    class Meta:
        model = SharedBudget
        fields = ['username', 'budget', 'year']
