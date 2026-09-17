#!/bin/sh

npm i /data/villas-conf-node
npm i nodemon

/usr/src/node-red/node_modules/.bin/nodemon \
  --watch /data/villas-conf-node/ \
  -e js,mjs,cjs,json,html \
  node_modules/node-red/red.js \
  --userDir /data \
  --settings /data/villas-conf-node/settings.js \
  $FLOWS