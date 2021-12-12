from django.core.management import BaseCommand

from apps.budget.models import ExpenseCategory, IncomeCategory


class Command(BaseCommand):
    help = 'Adds initial incomes and expenses categories.'

    def handle(self, *args, **options):
        incomes = [
            {'name': 'Salary'},
            {'name': 'Part-time job'},
            {'name': 'Investments'},
            {'name': 'Scholarship'},
            {'name': 'Pension'},
            {'name': 'Private lessons'},
            {'name': 'Other'},
        ]
        expenses = [
            {'name': 'Food'},
            {'name': 'Bills'},
            {'name': 'House'},
            {'name': 'Transport'},
            {'name': 'Clothes'},
            {'name': 'Medicine'},
            {'name': 'Tuition'},
            {'name': 'Children'},
            {'name': 'Other'},
        ]
        existing_incomes = IncomeCategory.objects.values_list('name', flat=True)
        existing_expenses = ExpenseCategory.objects.values_list('name', flat=True)

        incomes = list(filter(lambda x: x['name'] not in existing_incomes, incomes))
        expenses = list(filter(lambda x: x['name'] not in existing_expenses, expenses))

        incomes = [IncomeCategory(**income) for income in incomes]
        expenses = [ExpenseCategory(**expense) for expense in expenses]

        new_incomes = IncomeCategory.objects.bulk_create(incomes)
        new_expenses = ExpenseCategory.objects.bulk_create(expenses)

        print(f'Created {len(new_incomes)} new incomes.')
        print(f'Created {len(new_expenses)} new expenses.')
