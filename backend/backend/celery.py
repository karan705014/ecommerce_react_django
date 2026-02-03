import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')#give the setting of django to celery
app.autodiscover_tasks()#find tasks.py file in all the installed apps of django project
