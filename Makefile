install:
	npm install --save-dev babel-core babel-cli babel-preset-env babel-preset-stage-0
start:
	npm run babel-node -- src/bin/gendiff.js -h
publish:
	npm publish
lint:
	npm run eslint .
test:
	npm test
