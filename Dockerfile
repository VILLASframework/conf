FROM nodered/node-red:5.0.7

WORKDIR /data
COPY villas-conf-node/package.json /data

RUN npm install --no-update-notifier --no-fund --only=production

WORKDIR /usr/src/node-red
COPY villas-conf-node/ ./



#RUN npm install /data/villas-conf-node || echo "WARN: Villas node not found. Please mount correctly."

COPY settings.js /data/settings.js

EXPOSE 1880