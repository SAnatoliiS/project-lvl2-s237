install:
	npm install --save-dev babel-core babel-cli babel-preset-env babel-preset-stage-0
start:
	npm run babel-node -- src/bin/gendiff.js -h
publish:
	npm publish
lint:
	npm run eslint .
test:
<<<<<<< HEAD
	npm test
proc:
	gendiff --format plain ./__tests__/__fixtures__/before.ini ./__tests__/__fixtures__/after.ini
prog:
	/home/anatolii/Project2/src/bin/gendiff.js --format plain ./__tests__/__fixtures__/before.ini ./__tests__/__fixtures__/after.ini
=======
	npm test
>>>>>>> 7692648e00ed1de6e9c6896e3aafd56ad7f0b4fa
