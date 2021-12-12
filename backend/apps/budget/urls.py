from rest_framework.routers import DefaultRouter

from apps.budget.views import BudgetViewSet, IncomeCategoryView, ExpenseCategoryView

router = DefaultRouter()
router.register('', BudgetViewSet, basename='budgets')
router.register('income/categories', IncomeCategoryView, basename='income_categories')
router.register('expense/categories', ExpenseCategoryView, basename='expense_categories')

urlpatterns = router.urls
