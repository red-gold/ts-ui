# STACK_VER version of docker image in stack.yml file
# DOCKER_USER docker username

current_version_dir="$(shell pwd)/current_version"
STACK_VER?=`cat $(current_version_dir)`
DOCKER_USER?="qolzam"

.PHONY: prepare-push increase-ver build-dist up build-push 

all:
	make increase-ver build-dist up

prepare-push:
	make build-dist build-push

increase-ver:
	./hack/increase-ver.sh 2
	STACK_VER=`cat $(current_version_dir)`

build-dist:
	( docker run -v $(shell pwd):/ts-ui node:12-alpine /bin/sh -c "cd ts-ui && yarn && yarn build")

up:
	./hack/faas-up.sh $(STACK_VER) $(DOCKER_USER)

build-push:
	./hack/faas-build-push.sh $(STACK_VER) $(DOCKER_USER)
