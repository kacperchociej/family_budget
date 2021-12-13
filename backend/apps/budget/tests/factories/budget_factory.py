import factory

from apps.authentication.tests.factories.user_factory import UserFactory
from apps.budget.models import ExpenseCategory, IncomeCategory, Income, Expense, Budget


class ExpenseCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ExpenseCategory

    name = 'testname'


class IncomeCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = IncomeCategory

    name = 'testname'


class ExpenseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Expense

    name = 'testname'
    category = factory.SubFactory(ExpenseCategoryFactory)
    amount = 100


class IncomeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Income

    who = 'testname'
    category = factory.SubFactory(IncomeCategoryFactory)
    amount = 100


class BudgetFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Budget

    name = 'testname'
    user = factory.SubFactory(UserFactory)
    month = 'January'
    year = 2021

    @factory.post_generation
    def expenses(self, create, extracted, **kwargs):
        if not create:
            return

        for i in range(3):
            expense = ExpenseFactory.create()
            self.expenses.add(expense)

    @factory.post_generation
    def incomes(self, create, extracted, **kwargs):
        if not create:
            return

        for i in range(3):
            income = IncomeFactory.create()
            self.incomes.add(income)
