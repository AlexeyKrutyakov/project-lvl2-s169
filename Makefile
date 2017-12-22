install: install-deps install-flow-typed

run:
	npm run babel-node -- 'src/bin/gendiff.js' '__tests__/__fixtures__/comp-before.json' '__tests__/__fixtures__/comp-after.json' '-f' 'plain'

install-deps:
	npm install

install-flow-typed:
	npm run flow-typed install

build:
	rm -rf dist
	npm run build

test:
	npm test

check-types:
	npm run flow

lint:
	npm run eslint .

publish:
	npm publish

.PHONY: test
