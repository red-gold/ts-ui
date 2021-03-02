# STACK_VER version of docker image in stack.yml file
# DOCKER_USER docker username

current_version_dir="$(shell pwd)/current_version"
.PHONY: prepare-push increase-ver build-dist up build-push 

all:
	make increase-ver build-dist up

prepare-push:
	make build-dist faas-build faas-push

increase-ver:
	./hack/increase-ver.sh 2

build-dist:
	( docker run --env HOME_PAGE=$$HOME_PAGE -v $(shell pwd):/ts-ui node:12-alpine /bin/sh -c "cd ts-ui && yarn home-page && yarn && yarn build")

faas-up:
	faas up

faas-build:
	faas build

faas-push:
	faas push
