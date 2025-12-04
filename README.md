# Node-red Linked Data Nodes
This repository contains a number of [Node-RED](https://nodered.org/) nodes that allow you to work with Linked Data more easily.

To launch the Node-RED environment:
```bash
docker compose up -d --wait
```

To build and re-install the linked data nodes:
```bash
./build.sh
docker compose stop
./install.sh
docker compose start
```

To access the Node-RED graphical User interface: http://localhost:1880/

To test the conversion Node-RED pipeline:
```bash
clear
curl -X POST http://localhost:1880/convert -H "content-type: text/turtle" --data-binary @./data/test.ttl
curl -X POST http://localhost:1880/convert -H "content-type: application/n-triples" --data-binary @./data/test.nt
curl -X POST http://localhost:1880/convert -H "content-type: application/n-quads" --data-binary @./data/test.nq
curl -X POST http://localhost:1880/convert -H "content-type: application/x-trig" --data-binary @./data/test.trig
```

To validate the LDES client Node-RED pipeline, check the output in the debug window in the GUI. It may take a bit of time before the first data is dumped to the debug window.

To quit the Node-RED environment:
```bash
docker compose down
```

Have fun!
