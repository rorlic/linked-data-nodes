#!/bin/sh
rm -f ./node-red/nodes.tgz
cd src && tar -cf ../node-red/nodes.tgz ./*
