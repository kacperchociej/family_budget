#!/bin/sh

python manage.py loaddata fixtures/authentication.json --app auth.User
python manage.py loaddata fixtures/budget.json --app budget
