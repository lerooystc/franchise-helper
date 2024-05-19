sleep 30

su -m myuser -c "celery -A franchiser worker --pool=solo -l info"
