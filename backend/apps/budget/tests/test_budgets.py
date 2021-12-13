from django.urls import reverse
from rest_framework.exceptions import ErrorDetail
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.test import APITestCase, APIClient

from apps.authentication.tests.factories.user_factory import UserFactory
from apps.budget.models import Budget, SharedBudget
from apps.budget.serializers import BudgetSerializer
from apps.budget.tests.factories.budget_factory import BudgetFactory, ExpenseFactory, IncomeFactory


class BudgetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory.create()

    def tearDown(self):
        pass

    def test_budget_list(self):
        self.client.force_authenticate(user=self.user)

        BudgetFactory.create_batch(10)

        response = self.client.get(
            path=reverse('budgets-list')
        )

        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('next', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(5, len(response.data.get('results')))

    def test_budget_retrieve(self):
        self.client.force_authenticate(user=self.user)

        budget = BudgetFactory.create()

        response = self.client.get(
            path=reverse('budgets-detail', kwargs={'pk': budget.pk})
        )

        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertIn('name', response.data)
        self.assertIn('month', response.data)
        self.assertIn('year', response.data)
        self.assertIn('incomes', response.data)
        self.assertIn('expenses', response.data)
        self.assertIn('total_income', response.data)
        self.assertIn('total_expense', response.data)
        self.assertIn('created_at', response.data)

    def test_share_budget(self):
        self.client.force_authenticate(user=self.user)
        share_to = UserFactory.create(username='shareto')

        budget = BudgetFactory.create()

        response = self.client.post(
            path=reverse('budgets-share', kwargs={'pk': budget.pk}),
            data={'user': share_to.username}
        )

        self.assertEqual(response.status_code, HTTP_201_CREATED)
        self.assertIsInstance(response.data, list)

    def test_revoke_budget_access(self):
        self.client.force_authenticate(user=self.user)
        share_to = UserFactory.create(username='shareto')

        budget = BudgetFactory.create()

        response = self.client.post(
            path=reverse('budgets-share', kwargs={'pk': budget.pk}),
            data={'user': share_to.username}
        )
        access_id = response.data[0]['access_id']
        shared_budget = SharedBudget.objects.get(pk=access_id)

        response = self.client.delete(
            path=reverse('budgets-revoke', kwargs={'access_id': shared_budget.pk})
        )

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)
