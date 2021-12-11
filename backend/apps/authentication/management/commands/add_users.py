import os

from django.contrib.auth.models import User
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = 'Creating development admin user and test user.'

    def handle(self, *args, **options):
        admin_username = os.environ.get('ADMIN_LOGIN')
        admin_password = os.environ.get('ADMIN_PASSWORD')

        if admin_username and admin_password and not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username,
                email='sysadmin@email.com',
                password=admin_password
            )
            print('Admin user created.')

        test_user_username = os.environ.get('TESTUSER_LOGIN')
        test_user_password = os.environ.get('TESTUSER_PASSWORD')

        if test_user_username and test_user_password and not User.objects.filter(username=test_user_username).exists():
            test_user = User(username=test_user_username)
            test_user.set_password(test_user_password)
            test_user.save()
            print('Test user created.')



