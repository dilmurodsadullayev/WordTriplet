from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import EntryWordSerializer
from rest_framework.response import Response
from .translation import translate_text
from main.models import EntryWord, WordTranslation

# Create your views here.

from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import EntryWordSerializer, WordTranslationSerializer
from rest_framework.response import Response
from .translation import translate_text
from main.models import EntryWord, WordTranslation
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404


# Create your views here.

class Word(APIView):
    def get(self, request):
        words = WordTranslation.objects.all()
        serializer = WordTranslationSerializer(words, many=True)
        return Response(serializer.data)
    

    @swagger_auto_schema(
        operation_description="Create new word",
        request_body=EntryWordSerializer,
        responses={201: EntryWordSerializer}

    )

    
    def post(self, request):
        word_name = request.data.get('name')
        source = request.data.get('source')
        target = request.data.get('target', [])  

        if not word_name or not source or not target:
            return Response({"error": "name, source va target kerak"}, status=400)

        word = EntryWord.objects.create(name=word_name, source=source)
        print(word)

        translations_data = {}

        for lang in target[:3]:
            try:
                result = translate_text(word_name, source=source, target=lang)
            except Exception as e:
                result = f"Tarjima xatolik: {str(e)}"

            word_translation = WordTranslation.objects.create(
                word=word,
                translation=result,
                lang=lang
            )
            print(f"Translation created for language {word}: {word_translation}")

            translations_data[lang] = result

        return Response({
            "word": {
                "id": word.id,
                "name": word.name,
                "source": word.source,
                "created_at": word.created_at.isoformat()
            },
            "translations": translations_data
        })
    
class WordWithTranslationEditView(APIView):
    def get(self, request, word_id):
        try:
            word = EntryWord.objects.get(id=word_id)
        except EntryWord.DoesNotExist:
            return Response({"error": "Word not found"}, status=404)

        serializer = EntryWordSerializer(word)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Edit existing word",
        request_body=EntryWordSerializer,
        responses={200: EntryWordSerializer}

    )
    def put(self, request, word_id):
        try:
            word = EntryWord.objects.get(id=word_id)
        except EntryWord.DoesNotExist:
            return Response({"error": "Word not found"}, status=404)
        
        serializer = EntryWordSerializer(word, data=request.data, partial=True)
        data = request.data
        print(data)
        if serializer.is_valid():
            serializer.save()
            translations_data = {}

            for lang in data['target'][:3]:
                try:
                    result = translate_text(data['name'], source=data['source'], target=lang)
                    print(result)

                except Exception as e:
                    result = f"Tarjima xatolik: {str(e)}"

                word_translation = WordTranslation.objects.update_or_create(
                    word=word,
                    translation=result,
                    lang=lang
                )
                print(f"Translation update for language {word}: {word_translation}")

                translations_data[lang] = result
                
                print(data)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, word_id):
        word = get_object_or_404(EntryWord, id=word_id)
        try:
            word_translation = WordTranslation.objects.filter(word=word)
            word_translation.delete()   
        except WordTranslation.DoesNotExist:
            return Response({"error": "Word translation not found"}, status=404)

  
        return Response({"message": "Word translation deleted successfully"}, status=200)