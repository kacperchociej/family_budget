# Generated by Django 3.2.10 on 2021-12-12 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0003_auto_20211211_1007'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='name',
            field=models.CharField(default='Default budget name', max_length=100),
            preserve_default=False,
        ),
    ]
