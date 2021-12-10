from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)


class Expense(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)


class Income(models.Model):
    who = models.CharField(max_length=100)
    amount = models.IntegerField()


class Budget(models.Model):
    month = models.CharField(max_length=10)
    year = models.IntegerField()
    incomes = models.ManyToManyField(Income)
    expenses = models.ManyToManyField(Expense)
    created_at = models.DateTimeField(auto_now_add=True)


class SharedBudget(models.Model):
    OWNER = 'owner'
    SHARED = 'shared'
    SHARED_PERMISSION = [
        (OWNER, 'Owner'),
        (SHARED, 'Shared')
    ]

    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budget_access')
    shared_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='shared_access')
    granted_at = models.DateTimeField(auto_now_add=True)
    shared_permission = models.CharField(max_length=10, choices=SHARED_PERMISSION, default=OWNER)