#!/bin/sh

echo "${0}: wait for postgres."
python wait_for_postgres.py

status=$?

if [ $status -gt 0 ]
then
    echo "${0}: Cannot connect with postgres. Exiting..."
    exit $status
fi

echo "${0}: Running migrations."
python manage.py migrate --noinput

echo "${0}: Loading fixtures as initial app data."
./load_fixtures.sh

#echo "${0}: Creating initial incomes and expenses categories."
#python manage.py categories

#echo "${0}: Creating dev admin and test user."
#python manage.py add_users

echo "${0}: Starting gunicorn."
gunicorn backend.wsgi:application \
    --bind 0.0.0.0 \
    --timeout 1000 \
    --workers 2 \
    --log-level=info \
    --reload
"$@"