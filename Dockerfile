FROM nodered/node-red:5.0.7

COPY --chown=node-red:node-red villas-conf-node/settings.js /data/settings.js

COPY --chown=node-red:node-red villas-conf-node /tmp/villas-conf-node

# install villas-conf-node as npm package
RUN npm install --no-update-notifier --no-fund --omit=dev /tmp/villas-conf-node

WORKDIR /data
COPY packaging/deploy/entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]
EXPOSE 1880