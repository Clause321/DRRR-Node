from django.db import models

class Users(models.Model):
    username = models.CharField(max_length = 20)
    icon = models.CharField(max_length = 10)

    def __unicode__(self):
        return self.username

class ChatRoom(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name