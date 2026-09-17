FROM nodered/node-red:5.0.7

COPY villas-conf-node/ /data/villas-conf-node

WORKDIR /data/villas-conf-node
RUN npm install --no-update-notifier --no-fund --only=production

WORKDIR /usr/src/node-red

COPY /data/villas-conf-node/settings.js /data/settings.js

EXPOSE 1880