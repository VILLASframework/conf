#!/bin/bash

if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <conf-file>" >&2
    exit 1
fi

CONF_FILE="$1"
if [[ ! -f "$CONF_FILE" ]]; then
    echo "Error: conf file not found: $CONF_FILE" >&2
    exit 1
fi
CONF_FILE="$(realpath "$CONF_FILE")"

VILLAS_NODE_IMAGE=registry.git.rwth-aachen.de/acs/public/villas/node:latest

echo "Starte VILLASnode..."
docker run --rm --name villas-node \
    --volume "$CONF_FILE:/config.json:ro" \
    --privileged $VILLAS_NODE_IMAGE node /config.json &

# Speichere die Prozess-ID des Docker-Containers
PID=$!

WAIT=10
sleep $WAIT

echo "Beende VILLASnode nach $WAIT Sekunden"
# Stoppe den Container anhand des Namens
docker stop villas-node
docker rm villas-node

