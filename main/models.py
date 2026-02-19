from django.db import models

# Create your models here.

class LangEnum(models.TextChoices):
    UZ = "uz"
    EN = "en"
    RU = "ru"
    FR = "fr"

class EntryWord(models.Model):
    name = models.CharField(max_length=250)
    source = models.CharField(max_length=10, choices=LangEnum.choices)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name
    


class WordTranslation(models.Model):
    word = models.ForeignKey(EntryWord, on_delete=models.CASCADE)
    translation = models.TextField()
    lang = models.CharField(max_length=10, choices=LangEnum.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{str(self.word.name)} - {self.translation}"

