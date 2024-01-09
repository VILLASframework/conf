# VILLASconf

This is a noed-red based config file generator for VILLASnode configurations.


## Notes

Download to file:

```
npm install --production node-red-contrib-downloadfile
```

You have to create a containterData folder in the root directory to store the data files

### Install nodes
Currently the custom node needs to be installed by hand

- Connect to container
- run `npm i /villas-conf-node`


### Run with nodemon

This is only working within the devel system since there nodemon is installed via Dockerfile

```
/usr/src/node-red/node_modules/.bin/nodemon $NODE_OPTIONS node_modules/node-red/red.js --userDir /data $FLOWS "${@}"
```

### Rebuild with updated dockerfile

```
docker compose build --no-cache
```


## Usage

###Run VILLASnode

```
docker run --volume ./example_conf/example.json:/config.json --privileged registry.git.rwth-aachen.de/acs/public/villas/node node /config.json
```


## License
