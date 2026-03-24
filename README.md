# VILLASconf

**VILLASconf** is a Node-RED-based tool for graphical creation and management of VILLASnode configuration files.

---

## 📦 Installation

### Clone the repository

```bash
git clone https://git-ce.rwth-aachen.de/acs/private/research/target-x/villasconf.git
```

### Project structure (example)

```bash
villasconf/
├── villas-conf-node/
│   ├── nodes/
│   └── package.json
├── Dockerfile
├── settings.js
└── README.md
```

---

## 🛠️ Docker Image

Before running the container, make sure to build the Docker image.

Use the provided `Dockerfile` (in this project folder) to build a custom image with the VILLASconf:

```bash
docker build -t my-villas-image .
```


## 🐳 Docker-based Execution

### Start Node-RED with VILLASconf

After building the image, you can start the container using:

```bash
docker run -d \
  --name villas-nodered \
  -p 1880:1880 \
  -v $(pwd)/data:/data \
  my-villas-image
```

## ⚙️ Development & Custom Nodes

### Create a new Node

Create two files inside the `villas-conf-node/nodes` directory:

```bash
villasconf/villas-conf-node/nodes/
├── MyNode.js
├── MyNode.html
```

### Add the new node to `package.json`:

```json
"node-red": {
  "nodes": {
    "MyNode": "nodes/MyNode.js"
  }
}
```

### Install the node (locally or inside the container):

```bash
npm install ./villas-conf-node
```

### Restart the Node-RED container:

```bash
docker restart <container ID>
```

---

## 🔧 Development with nodemon (optional)

In a development setup using a Dockerfile that includes `nodemon`, you can start Node-RED like this:

```bash
/usr/src/node-red/node_modules/.bin/nodemon $NODE_OPTIONS node_modules/node-red/red.js --userDir /data $FLOWS "${@}"
```

---

## 📝 License

MIT License
(c) RWTH Aachen / ACS
