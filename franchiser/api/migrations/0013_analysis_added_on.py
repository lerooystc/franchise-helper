# Generated by Django 4.2.9 on 2024-05-09 00:35

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_analysis_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='analysis',
            name='added_on',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]