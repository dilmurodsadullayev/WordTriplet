from deep_translator import GoogleTranslator


def translate_text(text, source, target):

    from deep_translator import GoogleTranslator

    translated = GoogleTranslator(source=source, target=target).translate(text)

    return translated

