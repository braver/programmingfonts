default: install lint test fonts/stylesheets/stylesheet.css

install:
	npm install

lint:
	npx eslint *.js modules/*.js

test:
	npx jsonschema validate fonts-schema.json fonts.json
	python3 tools/validate.py

fonts/stylesheets/stylesheet.css: fonts/stylesheets/fonts.less
	npx lessc $^ $@

list:
	python3 tools/listing.py

serve:
	open "http://localhost:8000"
	python3 -m http.server
