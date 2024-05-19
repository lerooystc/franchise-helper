sleep 40

su -m myuser -c "celery -A franchiser beat -l info"