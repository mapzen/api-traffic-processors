#!/bin/bash


# validate params

if [ "$#" -ne 2 ]; then
  echo "need to call with env and service. for example: lambda.sh dev pelias"
  exit 1
fi

if [ "$1" != "dev" -a "$1" != "prod" ]; then
  echo "first param needs to be dev or prod"
  exit 1
fi

if [ "$2" = "pelias" ]; then
  parser="fastlyPeliasParser.js"
  function="lambdaS3Pelias"
elif [ "$2" = "vector" ]; then
  parser="fastlyVectorParser.js"
  function="lambdaS3Vector"
else
  echo "second param needs to be pelias or vector"
  exit 1
fi


# build lambda config file

echo '{
  "parser": "'$parser'",
  "formatter": "trafficSpaces.js",
  "exporter": {
    "filename": "kinesisExporter.js",
    "args": {
      "region": "us-east",
      "streamName": "api_hits_processing_'$1'"
    }
  }
}' > `dirname $0`/../config/lambdaS3.json


# build zip

npm install --production
npm prune --production
rm lambdaS3.zip
zip -r9 lambdaS3.zip ./ -x ".git/*" "test/*" "coverage/*" "deploy/*"


# upload to aws

aws lambda update-function-code \
  --region us-east-1 \
  --function-name $1 \
  --zip-file fileb://lambdaS3.zip
