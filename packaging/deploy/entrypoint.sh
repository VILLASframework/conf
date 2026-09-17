#!/bin/sh

npm i /villas-conf-node

node node_modules/node-red/red.js \
  --userDir /data \
  --settings /villas-conf-node/settings.js \
  $FLOWS
