from datetime import date

from django.db.models import Sum
from rest_framework import serializers

from apps.budget.models import Budget, ExpenseCategory, IncomeCategory, Expense, Income, SharedBudget


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['pk', 'name']


class IncomeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeCategory
        fields = ['pk', 'name']


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Expense
        fields = ['pk', 'name', 'category', 'category_name', 'amount']


class IncomeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Income
        fields = ['pk', 'who', 'category', 'category_name', 'amount']


class BudgetSerializer(serializers.ModelSerializer):
    user = serializers.CharField(read_only=True)

    total_income = serializers.SerializerMethodField(read_only=True)
    total_expense = serializers.SerializerMethodField(read_only=True)

    incomes = IncomeSerializer(many=True)
    expenses = ExpenseSerializer(many=True)

    class Meta:
        model = Budget
        fields = [
            'pk', 'name', 'user', 'month', 'year', 'incomes', 'expenses', 'total_income', 'total_expense', 'created_at'
        ]

    def validate_month(self, value):
        months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ]

        value = value.capitalize()
        if value not in months:
            raise serializers.ValidationError({'detail': 'Invalid month given.'})

        return value

    def validate_year(self, value):
        today = date.today()

        if value < 2000 or value > today.year:
            raise serializers.ValidationError(
                {'detail': f'Invalid year given. Year must be between 2000 and {today.year}.'}
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


class GrantBudgetAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedBudget
        fields = ['user']

    def create(self, validated_data):
        user = validated_data['user']
        budget = validated_data['budget']
        if SharedBudget.objects.filter(user=user, budget=budget).exists():
            raise serializers.ValidationError({'detail': 'Given user already has access to this budget.'})

        return super().create(validated_data)


class SharedBudgetSerializer(serializers.ModelSerializer):
    budget = BudgetSerializer()
    shared_by = serializers.CharField(source='shared_by.username', read_only=True)

    class Meta:
        model = SharedBudget
        fields = ['pk', 'budget', 'shared_by', 'granted_at']
