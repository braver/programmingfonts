default: install lint test fonts/stylesheets/stylesheet.css

install:
	npm install
	cd tools && python -m venv .venv
	cd tools && .venv/bin/python -m pip --require-virtualenv install -r requirements.txt

lint:
	npx eslint *.js modules/*.js

test:
	npx jsonschema validate fonts-schema.json fonts.json
	cd tools && .venv/bin/python tools/validate.py

fonts/stylesheets/stylesheet.css: fonts/stylesheets/fonts.less
	npx lessc $^ $@

list:
	cd tools && .venv/bin/python listing.py

serve:
	open "http://localhost:8000"
	python3 -m http.server
