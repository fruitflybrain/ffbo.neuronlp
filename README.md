# NeuroNLP Hemibrain with High Quality Neuron Visualization
This is the release of the Hemibrain NeuroNLP with high quality neuron visualization capability.

## Installation

A server running from the base directory (the directory index.html is in) will serve the NeuroNLP application. You will either need to connect to a local server, or the public server provided by us.

### Connecting to Remote Server

You can change the arguments to client.startConnection in NeuroNLP.js to connect to different servers. For example, to connect to our public server, replace
```
client.startConnection("guest", "guestpass", "ws://localhost:8081/ws");
```
with
```
client.startConnection("guest", "jije83b3jJN*31", "wss://hemibrain.neuronlp.fruitflybrain.org/ws");
```
This version of NeuroNLP will work with FFBO Hemibrain releases.