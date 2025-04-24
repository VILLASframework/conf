#!/bin/bash

VILLAS_DIR="${VILLAS_DIR:-/home/adduser/HIWI/VILLAS/villasconf/villas-conf-node}"

docker stop VILLAS 2>/dev/null
docker rm VILLAS 2>/dev/null

docker run -d --name VILLAS \
    -p 1880:1880 \
    -v "$VILLAS_DIR:/data" \
    nodered/node-red:3.1.0


docker logs -f VILLAS