from django.urls import reverse
from rest_framework.exceptions import ErrorDetail
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.test import APITestCase, APIClient

from apps.authentication.tests.factories.user_factory import UserFactory


class UserTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory.create()

    def tearDown(self):
        pass

    def test_user_can_login(self):
        response = self.client.post(
            path=reverse('authentication-login'),
            data={'username': self.user.username, 'password': 'testpasswd'}
        )

        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertTrue('user' in response.data)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh_token' in response.data)

    def test_user_can_logout(self):
        response = self.client.post(
            path=reverse('authentication-login'),
            data={'username': self.user.username, 'password': 'testpasswd'}
        )

        refresh_token = response.data.get('refresh_token')

        response = self.client.post(
            path=reverse('authentication-logout'),
            data={'refresh_token': refresh_token}
        )

        self.assertEqual(response.status_code, HTTP_204_NO_CONTENT)

    def test_user_can_refresh(self):
        response = self.client.post(
            path=reverse('authentication-login'),
            data={'username': self.user.username, 'password': 'testpasswd'}
        )

        refresh_token = response.data.get('refresh_token')

        response = self.client.post(
            path=reverse('authentication-refresh'),
            data={'refresh_token': refresh_token}
        )

        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertTrue('user' in response.data)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh_token' in response.data)

    def test_register(self):
        data = {
            'username': 'registeruser',
            'password': 'testpasswd',
            'password2': 'testpasswd'
        }

        response = self.client.post(
            path=reverse('authentication-register'),
            data=data
        )

        self.assertEqual(response.status_code, HTTP_201_CREATED)
        self.assertTrue('user' in response.data)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh_token' in response.data)

    def test_register_passwords_do_not_match(self):
        data = {
            'username': 'registeruser',
            'password': 'testpasswd1',
            'password2': 'testpasswd2'
        }

        response = self.client.post(
            path=reverse('authentication-register'),
            data=data
        )

        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('password'),
            [ErrorDetail(string='Passwords do not match.', code='invalid')]
        )

    def test_register_username_is_required(self):
        data = {
            'password': 'testpasswd',
            'password2': 'testpasswd'
        }

        response = self.client.post(
            path=reverse('authentication-register'),
            data=data
        )

        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('username'),
            [ErrorDetail(string='This field is required.', code='required')]
        )

    def test_register_password_is_required(self):
        data = {
            'username': 'registeruser',
            'password2': 'testpasswd'
        }

        response = self.client.post(
            path=reverse('authentication-register'),
            data=data
        )

        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('password'),
            [ErrorDetail(string='This field is required.', code='required')]
        )

    def test_register_password2_is_required(self):
        data = {
            'username': 'registeruser',
            'password': 'testpasswd'
        }

        response = self.client.post(
            path=reverse('authentication-register'),
            data=data
        )

        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('password2'),
            [ErrorDetail(string='This field is required.', code='required')]
        )
