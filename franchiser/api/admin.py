from django.contrib import admin
from .models import Partner, Contractor, Location, Article, Task, Analysis, Notification

admin.site.register(Partner)
admin.site.register(Contractor)
admin.site.register(Location)
admin.site.register(Article)
admin.site.register(Task)
admin.site.register(Analysis)
admin.site.register(Notification)
