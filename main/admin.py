from django.contrib import admin
from .models import EntryWord, WordTranslation

# -------------------------------------------------
# EntryWord admin
# -------------------------------------------------
@admin.register(EntryWord)
class EntryWordAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "source", "created_at")
    list_filter = ("source", "created_at")
    search_fields = ("name",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

# -------------------------------------------------
# WordTranslation admin
# -------------------------------------------------
@admin.register(WordTranslation)
class WordTranslationAdmin(admin.ModelAdmin):
    list_display = ("id", "word", "translation", "lang", "created_at")
    list_filter = ("lang", "created_at")
    search_fields = ("translation", "word__name")  # word__name bilan ForeignKey ustida search
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
