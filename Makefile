default: install lint test stylesheet

install:
	npm install
	cd tools && python3 -m venv .venv
	cd tools && .venv/bin/python -m pip --require-virtualenv install -r requirements.txt

lint:
	npx eslint *.js modules/*.js

test:
	cd tools && .venv/bin/python validate.py

stylesheet:
	cd tools && .venv/bin/python stylesheet.py > ../fonts/stylesheet.css

list:
	cd tools && .venv/bin/python listing.py

serve:
	open "http://localhost:8000"
	python3 -m http.server
