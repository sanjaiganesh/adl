# Build Instructions

## Globally Install packages:
 - `npm install -g @microsoft/rush` -- rush.js is used by this repository
 - `npm install -g @autorest/autorest` -- autorest beta needed to generate scenarios

## Local install
 - `npm install` - local install of typescript and eslint for the project
 - `rush update` - install modules packages

## Building code
 - `rush rebuild` to build the modules
 or
 - `rush watch` to setup the build watcher 
 or
 - in VSCode, just build (ctrl-shift-b)