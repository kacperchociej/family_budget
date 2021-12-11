#!/bin/sh

echo "${0}: Running migrations."
python manage.py migrate --noinput

echo "${0}: Creating dev admin user."
echo "from  django.contrib.auth.models import User; print('Admin exists') if User.objects.filter(username='${ADMIN_LOGIN}').exists() else User.objects.create_superuser('${ADMIN_LOGIN}', 'sysadmin@some_email.com', '${ADMIN_PASSWORD}')" | python manage.py shell

echo "${0}: Starting gunicorn."
gunicorn backend.wsgi:application \
    --bind 0.0.0.0 \
    --timeout 1000 \
    --workers 2 \
    --log-level=info \
    --reload
"$@"