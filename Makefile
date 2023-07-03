default: install lint test fonts/stylesheets/stylesheet.css

install:
	npm install

lint:
	npx eslint *.js

test:
	npx ajv -c ajv-formats -s fonts-schema.json -d fonts.json

fonts/stylesheets/stylesheet.css: fonts/stylesheets/fonts.less
	npx lessc $^ $@
