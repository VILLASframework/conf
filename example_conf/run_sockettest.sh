#!/bin/bash
CONF_RECV="socket_recv.json"
CONF_RECV="$(realpath "$CONF_RECV")"
CONTAINER_RECV="nodeRecv"
CONTAINER_IP_RECV="172.20.0.10"

CONF_SEND="socket_send.json"
CONF_SEND="$(realpath "$CONF_SEND")"
CONTAINER_SEND="nodeSend"
CONTAINER_IP_SEND="172.20.0.11"

VILLAS_NODE_IMAGE=registry.git.rwth-aachen.de/acs/public/villas/node:latest

NETWORK="udp-test-network"
echo "Creating docker network $NETWORK ..."
docker network create --subnet=172.20.0.0/24 $NETWORK

echo "Starting VILLASnode containers $CONTAINER_RECV & $CONTAINER_SEND ..."
docker run -d --name $CONTAINER_RECV \
    --volume "$CONF_RECV:/config.json:ro" \
    --network $NETWORK \
    --ip $CONTAINER_IP_RECV \
    --privileged $VILLAS_NODE_IMAGE node /config.json &

docker run -d --name $CONTAINER_SEND \
    --volume "$CONF_SEND:/config.json:ro" \
    --network $NETWORK \
    --ip $CONTAINER_IP_SEND \
    --privileged $VILLAS_NODE_IMAGE node /config.json &

sleep 1
WAIT=150
echo "Executing containers $CONTAINER_RECV & $CONTAINER_SEND for $WAIT seconds..."
sleep $WAIT
 
echo "Stopping and cleaning up docker containers and network..."
docker stop $CONTAINER_RECV $CONTAINER_SEND
docker rm $CONTAINER_RECV $CONTAINER_SEND
docker network rm $NETWORK