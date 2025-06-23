# Basis-Image
FROM nodered/node-red:3.1.0


COPY villas-conf-node /data/villas-conf-node

RUN npm install /data/villas-conf-node || echo "WARN: Villas node not found. Please mount correctly."

COPY settings.js /data/settings.js


# Standard-Port
EXPOSE 1880