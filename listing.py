import json

TEMPLATE = "- [{name}]({url}) _{license}_"

with open('fonts.json') as user_file:
    file_contents = user_file.read()

    data = json.loads(file_contents)
    for key in data:
        print(TEMPLATE.format(
            name=data[key]['name'],
            url=data[key]['website'],
            license=data[key].get('license', '')))
