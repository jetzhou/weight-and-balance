.PHONY: build

run:
	./node_modules/.bin/react-scripts start

build:
	./node_modules/.bin/react-scripts build

test:
	./node_modules/.bin/react-scripts test --env=jsdom

eject:
	./node_modules/.bin/react-scripts eject

deploy: build
	./node_modules/.bin/gh-pages -d build
