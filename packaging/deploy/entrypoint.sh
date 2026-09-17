#!/bin/sh

npm i /data

node node_modules/node-red/red.js --userDir /data $FLOWS
