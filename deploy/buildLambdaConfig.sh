#!/bin/bash


# validate params

if [ "$#" -ne 1 ]; then
  echo "need to call with env. for example: buildLambdaConfig.sh dev"
  exit 1
fi

if [ "$1" != "dev" -a "$1" != "prod" -a "$1" != "test" ]; then
  echo "param needs to be dev, prod, or test"
  exit 1
fi

region="us-east-1"


# build lambda config file

mkdir -p config

echo '{
  "parsers": {
    "pelias": "fastlyPeliasParser.js",
    "vector": "fastlyVectorParser.js"
  },
  "formatter": "trafficSpaces.js",
  "exporter": {
    "filename": "kinesisExporter.js",
    "args": {
      "region": "'$region'",
      "streamName": "api_hits_processing_'$1'"
    }
  },
  "destBucket": "mapzen-fastly-logs",
  "destPrefix": "'$1'"
}' > `dirname $0`/../config/lambdaS3.json
