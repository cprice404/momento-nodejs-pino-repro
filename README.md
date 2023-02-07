# momento-nodejs-pino-repro

In this repo I have created two subdirs, `momento-0.18.0` and `momento-0.21.0`.

Each directory contains

* The provided package.json file (with momento version set accordingly)
* A `myapp.ts` file that contains the provided code/config snippets for instantiating the momento client, plus a basic `main` function that just does a few trivial cache interactions
* A `clean-build-run.sh` bash script which validates that the MOMENTO_TOKEN env var is set, does a clean install of npm dependencies, runs the typescript compiler, and then runs the simple `myapp.js` script.
