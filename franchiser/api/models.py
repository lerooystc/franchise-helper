from django.db import models


class OwnedModel(models.Model):
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Partner(OwnedModel):
    name = models.CharField(max_length=200)
    franchiser = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="partners")
    city = models.CharField(max_length=200)
    gantt_created = models.BooleanField(default=False)
    starting_date = models.DateField(null=True, blank=True)
    location_found = models.BooleanField(default=False)


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
    

class Task(OwnedModel):
    franchiser = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    duration = models.IntegerField()
    related_ids = models.CharField(max_length=50)