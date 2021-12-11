from datetime import date

from django.db.models import Sum
from rest_framework import serializers

from apps.budget.models import Budget, ExpenseCategory, IncomeCategory, Expense, Income


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['pk', 'name', 'category', 'amount']


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['pk', 'who', 'category', 'amount']


class BudgetSerializer(serializers.ModelSerializer):
    total_income = serializers.SerializerMethodField(read_only=True)
    total_expense = serializers.SerializerMethodField(read_only=True)

    incomes = IncomeSerializer(many=True)
    expenses = ExpenseSerializer(many=True)

    class Meta:
        model = Budget
        fields = ['pk', 'month', 'year', 'incomes', 'expenses', 'total_income', 'total_expense', 'created_at']

    def validate_month(self, value):
        months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'Septemper', 'October', 'November', 'December'
        ]

        if value.capitalize() not in months:
            raise serializers.ValidationError({'message': 'Invalid month given.'})

        return value

    def validate_year(self, value):
        today = date.today()

        if value < 2000 or value > today.year:
            raise serializers.ValidationError(
                {'message': f'Invalid year given. Year must be between 2000 and {today.year}.'}
            )

        return value

    def create(self, validated_data):
        incomes_validated = validated_data.pop('incomes')
        expenses_validated = validated_data.pop('expenses')

        budget = Budget.objects.create(**validated_data)

        incomes_serializer = self.fields['incomes']
        expenses_serializer = self.fields['expenses']

        incomes = incomes_serializer.create(incomes_validated)
        expenses = expenses_serializer.create(expenses_validated)

        budget.incomes.add(*incomes)
        budget.expenses.add(*expenses)

        return budget

    def get_total_income(self, obj):
        return obj.incomes.all().aggregate(Sum('amount'))['amount__sum'] or 0

    def get_total_expense(self, obj):
        return obj.expenses.all().aggregate(Sum('amount'))['amount__sum'] or 0
