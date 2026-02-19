from rest_framework.serializers import ModelSerializer
from main.models import EntryWord, WordTranslation

class EntryWordSerializer(ModelSerializer):
    class Meta:
        model = EntryWord
        fields = ['id', 'name', 'source', 'created_at']


class WordTranslationSerializer(ModelSerializer):
    word = EntryWordSerializer(read_only=True)
    class Meta:
        model = WordTranslation
        fields = ['id', 'word', 'translation', 'lang', 'created_at']