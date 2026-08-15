import json
import argparse
from os import path, unlink
from hyperglot.checker import FontChecker
from fontTools.ttLib import TTFont, woff2

'''
List various metadata about each font. Requires:
fonttools - https://github.com/fonttools/fonttools
hyperglot - https://github.com/rosettatype/hyperglot
brotli (for woff files) - https://github.com/google/brotli
'''

# optional --name foo arguments
parser = argparse.ArgumentParser(prog='FontInfo')
parser.add_argument('--name')
args = parser.parse_args()

# monolisa and input don't have files in this repo
# to run the script on these ensure the real font file is at the correct path
# then run with the --name argument
skip = ['monolisa']

lang_count = {
    'Arabic': 48,
    'Armenian': 2,
    'Bamum': 1,
    'Bengali': 8,
    'Buginese': 1,
    'Burmese': 4,
    'Chakma': 1,
    'Cherokee': 1,
    'Chinese': 7,
    'Cree': 1,
    'Cyrillic': 93,
    'Devanagari': 15,
    'Georgian': 4,
    'Geʽez': 8,
    'Greek': 3,
    'Gujarati': 2,
    'Gurmukhi': 2,
    'Hangul': 1,
    'Hanja': 1,
    'Hanunoo': 1,
    'Hebrew': 5,
    'Hiragana': 2,
    'Inuktitut Syllabics': 1,
    'Kanji': 1,
    'Kannada': 1,
    'Katakana': 3,
    'Kayah Li': 2,
    'Khmer': 1,
    'Lao': 1,
    'Latin': 547,
    'Malayalam': 1,
    'Modern Yi': 1,
    'Ojibwe Syllabics': 1,
    'Oriya': 1,
    'Sinhala': 1,
    'Syriac': 1,
    'Tai Viet': 1,
    'Tamil': 1,
    'Telugu': 1,
    'Thaana': 1,
    'Thai': 1,
    'Tham': 1,
    'Tibetan': 3,
    'Tifinagh': 1,
    'Vai': 1,
}


with open('fonts.json', 'r+') as user_file:
    file_contents = user_file.read()

    data = json.loads(file_contents)
    for key in data:
        if args.name and key != args.name:
            continue

        if not args.name and key in skip:
            continue

        print('')
        print('---------- ' + key + '----------')

        dir = path.join('.', 'fonts', 'resources', key)
        font_file = None
        for ext in ['.ttf', '.otf', '.woff', '.woff2']:
            if path.isfile(path.join(dir, key + ext)):
                font_file = path.join(dir, key + ext)
                break

        if font_file is None:
            print('No font file found')
            continue

        font = TTFont(font_file)
        print(font["name"].getBestFullName())
        # this isn't always the name we take, but useful to check the diff:
        # data[key]['name'] = font["name"].getBestFullName()

        print(font["name"].getName(1, 3, 1))  # 1 family name
        print(font["name"].getName(8, 3, 1))  # 8 manufacturer name
        print(font["name"].getName(0, 3, 1))  # 0 copyright

        designer = font["name"].getName(9, 3, 1)  # 9 designer
        print(designer)
        # this isn't always the author we take, but useful to check the diff:
        # if designer:
        #     data[key]['author'] = str(designer)

        print(font['maxp'].numGlyphs)
        data[key]['glyphs'] = int(font['maxp'].numGlyphs)

        '''
        name table:
        https://learn.microsoft.com/en-us/typography/opentype/spec/name
        platform 1 = macos, 3 = windows
        encoding 0 = roman, 1 = unicode
        '''

        try:
            woff2.decompress(font_file, 'tmp.otf')
            checker = FontChecker('tmp.otf')
            print(len(checker.characters))  # encoded characters
            data[key]['characters'] = len(checker.characters)
            print('langs:')
            langs = checker.get_supported_languages()
            data[key]['languages'] = {}
            for lang in langs:
                print(lang, len(langs[lang]), lang_count[lang])
                data[key]['languages'][str(lang)] = len(langs[lang])
            unlink('tmp.otf')
        except Exception:
            print('language support could not be detected')

    user_file.seek(0)  # roll back to start of file
    json.dump(data, user_file, indent=4, ensure_ascii=False)  # insert the new data
    user_file.truncate()  # remove everything else
