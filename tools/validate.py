import json
import sys
from jsonschema import validate

with open('../fonts.json', 'r') as f:
    data = json.load(f)

with open('../fonts-schema.json', 'r') as f:
    schema = json.load(f)


# base json schema validation
validate(instance=data, schema=schema)


# additional grouping validation
ok = True
for alias, font in data.items():
    if 'group' not in font or not font['group']:
        continue

    # Self-reference is valid — this font is a parent
    if font['group'] == alias:
        continue

    # Group key must exist
    if font['group'] not in data:
        print(
            f'{alias}: group "{font["group"]}" does not match any font key',
            file=sys.stderr,
        )
        ok = False
        continue

    # Target must be a parent (self-referencing), not another child — no two-level nesting
    if data[font['group']].get('group') != font['group']:
        print(
            f'{alias}: group "{font["group"]}" is not a parent (a parent must have group equal to its own key)',
            file=sys.stderr,
        )
        ok = False

if not ok:
    sys.exit(1)
