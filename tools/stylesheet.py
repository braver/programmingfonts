import json
from os import path

'''
Generate @font-faces for all font files.
'''

# monolisa doesn't have files in this repo
skip = ['monolisa']


def font_face(name, path, weight='normal', style='normal'):
    return f'@font-face {{ font-family: "{name}"; font-weight: {weight}; font-style: {style}; src: url("{path}"); }}'  # noqa: E501


with open('../fonts.json', 'r+') as user_file:
    file_contents = user_file.read()

    data = json.loads(file_contents)
    for key in data:
        if key in skip:
            continue

        dir = path.join('..', 'fonts', 'resources', key)
        font_files = []
        for variant in ['', '-bold', '-italic', '-bold-italic']:
            for ext in ['.ttf', '.otf', '.woff', '.woff2']:
                possible_path = path.join(dir, key + variant + ext)
                if path.isfile(possible_path):
                    weight = 'bold' if 'bold' in variant else 'normal'
                    style = 'italic' if 'italic' in variant else 'normal'
                    print(font_face(
                        key,
                        path.join('.', 'resources', key, key + variant + ext),
                        weight,
                        style))
