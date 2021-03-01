#!/bin/bash

export STACK_VER="latest"
echo "STACK_VER: "$1
if [ $1 ] ; then
  STACK_VER=$1
fi

export DOCKER_USER="qolzam"
echo "DOCKER_USER: "$2
if [ $2 ] ; then
  DOCKER_USER=$2
fi

faas up