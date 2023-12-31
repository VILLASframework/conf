FROM nodered/node-red

RUN npm install nodemon


#ENTRYPOINT [ "/bin/sleep", "3660" ]

ENTRYPOINT ["/usr/src/node-red/node_modules/.bin/nodemon", "--watch", "/villas-conf-node/", "-e", "js,mjs,cjs,json,html", "node_modules/node-red/red.js", "--userDir", "/data", "$FLOWS"] 