import argparse
import json
import re
from pathlib import Path
from os import path
from fontTools.ttLib import woff2

'''
Convert otf/ttf to woff2. Requires:
fonttools - https://github.com/fonttools/fonttools
brotli - https://github.com/google/brotli

Note: since the woff2 is functionally equivalent this is assumed to be ok
under the licenses of the fonts included in the project, because we're doing
a straight up conversion without further modification or optimization.
https://openfontlicense.org/webfonts-and-reserved-font-names/
'''

# optional --name foo arguments
parser = argparse.ArgumentParser(prog='FontInfo')
parser.add_argument('--name')
args = parser.parse_args()

# unifont is subsetted, monolisa and input don't have files in this repo
# to run the script on these ensure the real font file is at the correct path
# then run with the --name argument
skip = ['unifont', 'monolisa', 'input']


def convert_extension(file):
    return re.sub(r'\.(ttf|otf|woff)$', '.woff2', file)


with open('fonts.json', 'r+') as user_file:
    file_contents = user_file.read()

    data = json.loads(file_contents)
    for key in data:
        if args.name and key != args.name:
            continue

        if not args.name and key in skip:
            continue

        dir = path.join('.', 'fonts', 'resources', key)
        font_files = []
        for variant in ['', '-bold', '-italic', '-bold-italic']:
            for ext in ['.ttf', '.otf', '.woff']:
                possible_path = path.join(dir, key + variant + ext)
                if path.isfile(possible_path):
                    font_files.append(possible_path)
                    break

        if len(font_files) == 0:
            continue

        for font_file in font_files:
            woff2.compress(font_file, convert_extension(font_file))
            old = Path(font_file)
            old.unlink()

        print(key + ' compressed to woff2')
