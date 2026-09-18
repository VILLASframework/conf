FROM nodered/node-red:5.0.7

COPY villas-conf-node /villas-conf-node

RUN npm install /villas-conf-node

COPY --chown=node-red:node-red packaging/deploy/entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
EXPOSE 1880