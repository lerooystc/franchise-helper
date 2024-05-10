# Generated by Django 4.2.9 on 2024-05-10 21:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_analysis_template_analysis_template_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='analysis',
            name='template_name',
        ),
        migrations.AddField(
            model_name='analysis',
            name='title',
            field=models.CharField(default='Анализ', max_length=100),
            preserve_default=False,
        ),
    ]
