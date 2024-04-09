from time import sleep
from celery import shared_task
from franchiser.celery import app
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.request import urlopen, Request
from .models import Article

#celery -A franchiser worker --pool=solo -l info 
#celery -A franchiser beat -l info

@app.task
def get_articles():
    req = Request('https://topfranchise.ru/novosti-franshizy/', headers={"User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)"})
    html = urlopen(req).read()
    bs = BeautifulSoup(html, 'html.parser')
    link_start = 'https://topfranchise.ru'
    articles = bs.find_all('div', {"class":"element"})
    for article in articles:
        main = article.find('a')
        url = link_start + main['href']
        image = link_start + main.find('img')['src']
        title = main.find('div').find('p').text
        date_published = datetime.strptime(article.find(itemprop="datePublished").get("content"), '%Y-%m-%d')
        queryset = Article.objects.filter(url=url)
        if queryset.count() == 0:
            Article.objects.create(title = title, image = image, date_published = date_published, url = url)
        sleep(5)
        
        
@app.task
def sample_task():
    print(" task one called and worker is running good")
    return "success"