#!/bin/bash

echo "Baue Villasnode Docker-Image neu..."
docker build -t villas-conf-node /home/adduser/HIWI/VILLAS/example_conf/

echo "Starte VILLASnode..."
docker run --rm --name villas-node \
    --volume /home/adduser/HIWI/VILLAS/example_conf/example.json:/config.json \
    --privileged villas-conf-node node /config.json &

# Speichere die Prozess-ID des Docker-Containers
PID=$!

# Warte 0.5 Sekunde
sleep 60

echo "Beende VILLASnode nach 1 Sekunde"
# Stoppe den Container anhand des Namens
docker stop villas-node
docker rm villas-node


