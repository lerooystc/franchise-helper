# Generated by Django 4.2.9 on 2024-05-10 21:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='analysis',
            name='template',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='analysis',
            name='template_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]