#!/bin/sh

set -e
flake8 . --ignore=E501 --exclude=.svn,CVS,.bzr,.hg,.git,__pycache__,.tox,.eggs,*.egg,version.py,*.yml,*.csv,*.json
set +e
