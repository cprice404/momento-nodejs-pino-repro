#!/usr/bin/env bash

if [ "$MOMENTO_TOKEN" == "" ];
then
   echo "Missing required env var MOMENTO_TOKEN"
   exit 1
fi

rm -rf package-lock.json node_modules
npm install
npx tsc
npx node ./myapp.js
