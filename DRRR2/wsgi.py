"""
WSGI config for DRRR2 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""
from os import path
import os
import sys

projectPath = path.dirname(path.dirname(path.abspath(__file__)))
if not projectPath in sys.path:
	sys.path.append(projectPath)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DRRR2.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
