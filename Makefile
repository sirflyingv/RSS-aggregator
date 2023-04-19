install:
	npm install

build:
	npm run build

run:
	npx webpack serve

lint_fix:
	npx eslint src/** --fix