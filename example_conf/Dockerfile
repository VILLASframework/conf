FROM registry.git.rwth-aachen.de/acs/public/villas/node:latest

# Installiere Node.js und npm
RUN apt-get update && apt-get install -y nodejs npm

# Setze NODE_PATH, falls benötigt
ENV NODE_PATH=/villas

# Kopiere den Custom Node in das korrekte Verzeichnis
COPY nodes/ /data/nodes/
COPY package.json /villas/package.json

WORKDIR /villas

# Installiere das Modul lokal oder global, je nachdem, was für deine Umgebung nötig ist
RUN npm install .

RUN apt-get clean && rm -rf /var/lib/apt/lists/*
