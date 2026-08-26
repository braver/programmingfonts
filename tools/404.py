import json
import urllib.request


def check_url_status(url, name):
    try:
        response = urllib.request.urlopen(url)
        print('{} - {}'.format(response.getcode(), name))
    except Exception:
        return print('ERROR - {}'.format(name))


with open('fonts.json') as user_file:
    file_contents = user_file.read()

    data = json.loads(file_contents)
    for key in data:
        check_url_status(
            data[key]['website'],
            data[key]['name'])
