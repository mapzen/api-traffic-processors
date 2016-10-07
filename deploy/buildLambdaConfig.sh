#!/bin/bash


# validate params

if [ "$#" -eq 0 ]; then
  echo "example:"
  echo "buildLambdaConfig.sh dev"
  echo "buildLambdaConfig.sh dev pause"
  exit 1
fi

if [ "$1" != "dev" -a "$1" != "prod" -a "$1" != "test" ]; then
  echo "param needs to be dev, prod, or test"
  exit 1
fi

if [ "$#" -eq 2 -a "$2" != "pause" ]; then
  echo "second param needs to be pause"
  exit 1
fi

region="us-east-1"


# build lambda config file

mkdir -p config

if [ "$2" = "pause" ]; then

echo '{
  "pause": "true",
  "pauseBucket": "mapzen-fastly-logs",
  "pausePrefix": "'$1'-logs-paused"
}' > `dirname $0`/../config/lambdaS3.json

else

echo '{
  "pelias": {
    "parser": "fastlyPeliasParser.js",
    "outputs": [
      {
        "formatter": "apiHits.js",
        "exporter": {
          "filename": "kinesisExporter.js",
          "args": {
            "region": "'$region'",
            "streamName": "api_hits_processing_'$1'"
          }
        }
      },
      {
        "formatter": "peliasTraffic.js",
        "exporter": {
          "filename": "kinesisExporter.js",
          "args": {
            "region": "'$region'",
            "streamName": "pelias_traffic_processing_'$1'"
          }
        }
      }
    ]
  },
  "vector": {
    "parser": "fastlyVectorParser.js",
    "outputs": [
      {
        "formatter": "apiHits.js",
        "exporter": {
          "filename": "kinesisExporter.js",
          "args": {
            "region": "'$region'",
            "streamName": "api_hits_processing_'$1'"
          }
        }
      },
      {
        "formatter": "vectorTraffic.js",
        "exporter": {
          "filename": "kinesisExporter.js",
          "args": {
            "region": "'$region'",
            "streamName": "tile_traffic_processing_'$1'"
          }
        }
      }
    ]
  }
}' > `dirname $0`/../config/lambdaS3.json

fi
