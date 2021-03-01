# STACK_VER version of docker image in stack.yml file
# DOCKER_USER docker username

STACK_VER?=$(<current_version)

.PHONY: increase-ver build-dist build push deploy

all:
	make increase-ver build-dist build push deploy

increase-ver:
	./hack/increase-ver.sh
	STACK_VER?=$(<current_version)

build-dist:
	( docker run -v $(shell pwd):/ts-ui node:12-alpine /bin/sh -c "cd ts-ui && yarn && yarn build")

build:
	faas-cli build

push:
	faas-cli push

deploy:
	faas-cli deploy