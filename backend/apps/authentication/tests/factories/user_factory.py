import factory
from django.contrib.auth.models import User


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username', )

    username = 'testuser'
    password = factory.PostGenerationMethodCall('set_password', 'testpasswd')
