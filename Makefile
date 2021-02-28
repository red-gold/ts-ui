.PHONY: build-dist build push deploy

all:
	make build-dist build push deploy

build-dist:
	( docker run -v $(shell pwd):/ts-ui node:12-alpine /bin/sh -c "cd ts-ui && yarn && yarn build")

build:
	faas-cli build

push:
	faas-cli push

deploy:
	faas-cli deploy