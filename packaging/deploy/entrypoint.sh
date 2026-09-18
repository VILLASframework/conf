#!/bin/sh

npm i /villas-conf-node

node node_modules/node-red/red.js \
  --settings /villas-conf-node/settings.js \
  --userDir /data \
  $FLOWS
