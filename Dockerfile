FROM nodered/node-red:5.0.7

COPY --chown=node-red:node-red villas-conf-node /data/villas-conf-node

WORKDIR /data/villas-conf-node
RUN npm install --no-update-notifier --no-fund --omit=dev

WORKDIR /usr/src/node-red

COPY villas-conf-node/settings.js /data/settings.js

EXPOSE 1880