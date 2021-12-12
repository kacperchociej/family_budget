#!/bin/sh

python manage.py dumpdata auth.User --indent 4 > fixtures/authentication.json
python manage.py dumpdata budget --indent 4 > fixtures/budget.json
