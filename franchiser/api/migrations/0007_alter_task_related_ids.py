# Generated by Django 4.2.9 on 2024-04-18 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_partner_location_found_partner_tasks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='related_ids',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
