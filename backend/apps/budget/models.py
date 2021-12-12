from django.contrib.auth.models import User
from django.db import models


class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100)


class IncomeCategory(models.Model):
    name = models.CharField(max_length=100)


class Expense(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(ExpenseCategory, null=True, on_delete=models.SET_NULL)
    amount = models.IntegerField()


class Income(models.Model):
    who = models.CharField(max_length=100)
    category = models.ForeignKey(IncomeCategory, null=True, on_delete=models.SET_NULL)
    amount = models.IntegerField()


class Budget(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.CharField(max_length=10)
    year = models.IntegerField()
    incomes = models.ManyToManyField(Income)
    expenses = models.ManyToManyField(Expense)
    created_at = models.DateTimeField(auto_now_add=True)


class SharedBudget(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budget_access')
    shared_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='shared_access')
    granted_at = models.DateTimeField(auto_now_add=True)
