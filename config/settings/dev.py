from .base import *

DEBUG = True
DATABASES['default']['NAME'] = os.getenv('DB_NAME', 'ecommerce_db')
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'