#!/bin/sh

/usr/bin/node node_modules/node-red/red.js --userDir /data $FLOWS &

cd /data
npm i /villas-conf-node

sleep infinity