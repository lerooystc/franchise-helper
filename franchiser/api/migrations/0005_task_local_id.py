# Generated by Django 4.2.9 on 2024-04-09 23:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_contractor_owner_location_owner_partner_owner_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='local_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
