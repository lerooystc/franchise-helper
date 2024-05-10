from django.db import models
import random
import string


def generate_unique_code():
    length = 8

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Analysis.objects.filter(access_code=code).count() == 0:
            break

    return code


class OwnedModel(models.Model):
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Task(OwnedModel):
    franchiser = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="tasks")
    local_id = models.IntegerField()
    title = models.CharField(max_length=50)
    duration = models.IntegerField()
    parents = models.ManyToManyField("self", symmetrical=False, blank=True)
    
    def __str__(self):
       return self.title


class Partner(OwnedModel):
    name = models.CharField(max_length=200)
    franchiser = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="partners")
    city = models.CharField(max_length=200)
    gantt_created = models.BooleanField(default=False)
    starting_date = models.DateField(null=True, blank=True)
    tasks = models.ManyToManyField(Task, related_name="partners", blank=True)


class Location(OwnedModel):
    name = models.CharField(max_length=200)
    partner = models.ForeignKey("Partner", on_delete=models.CASCADE, related_name="locations")
    address = models.CharField(max_length=200)


class Contractor(OwnedModel):
    name = models.CharField(max_length=200)
    partner = models.ForeignKey("Partner", on_delete=models.CASCADE, related_name="contractors")


class Article(models.Model):
    title = models.CharField(max_length=200)
    image = models.URLField(null=True, blank=True)
    date_published = models.DateField()
    url = models.TextField()
    
    def __str__(self):
        return self.title
    

class Analysis(OwnedModel):
    partner = models.ForeignKey("Partner", on_delete=models.CASCADE, related_name="analyses")
    title = models.CharField(max_length=100)
    criteria = models.JSONField()
    cases = models.JSONField(null=True, blank=True)
    finished = models.BooleanField()
    added_on = models.DateTimeField(auto_now_add=True)
    access_code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    is_template = models.BooleanField()
    
    
class Notification(models.Model):
    franchiser = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="notifications")
    seen = models.BooleanField(default=False)
    title = models.CharField(max_length=200)
    link = models.CharField(max_length=200)
    added_on = models.DateTimeField(auto_now_add=True)