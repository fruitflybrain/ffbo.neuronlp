# ffbo.neuronlp

This repository is the frontend codebase for the [BrainMapsViz](https://www.fruitflybrain.org/#/brainmapsviz) NeuroNLP web applications.

## Development

The codebase can be divided into two parts.

1. Frontend javascript code in `js/`: the js codes should typically be dataset independent and should be updated primarily in the `develop` branch.
2. Configuration files under `config/` and `data/`: the configuration files are specified based on the actual datasets. The configuration files for different datasets live in different branches, and they should be only updated in their respective branches. Current branch - dataset mapping is the following:

- hemibrain - Hemibrain dataset
- flycircuit - FlyCircuit dataset
- l1em - Larva L1EM dataset
- medulla - Medulla 7 column dataset
- manc - male adult nerve cord (MANC) dataset
- flywire - FlyWire dataset

Features developed in the `develop` branch should be merged into dataset branches, NEVER merge dataset branches back to develop/master. To facilitate this style, `.gitattributes` defines the files that will be ignored during merge. For example, when merging `develop` into a dataset branch, any changes in the `index.html` in the `develop` branch will be ignored. Please set the merge driver by running the following command on command line before merging:

```bash
git config --global merge.ours.driver true
```

