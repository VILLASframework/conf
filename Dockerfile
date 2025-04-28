# Basis-Image
FROM nodered/node-red:3.1.0

# Umgebung definieren
COPY villas-conf-node /data/villas-conf-node

# VILLAS Node installieren
# (vorausgesetzt, villas-conf-node ist bereits gemountet!)
RUN npm install /data/villas-conf-node || echo "WARN: Villas node not found. Please mount correctly."


# Standard-Port
EXPOSE 1880
