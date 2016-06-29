#!/bin/bash


# validate params

if [ "$#" -eq 0 ]; then
  echo "example usage:"
  echo "  lambda.sh dev"
  echo "  lambda.sh dev pause"
  exit 1
fi

if [ "$1" != "dev" -a "$1" != "prod" ]; then
  echo "param needs to be dev or prod"
  exit 1
fi

if [ "$#" -eq 2 -a "$2" != "pause" ]; then
  echo "second param needs to be pause"
  exit 1
fi

region="us-east-1"


# build lambda config file

./deploy/buildLambdaConfig.sh $1 $2


# build zip

[ -d node_modules ] && mv node_modules node_modules_dev
[ -d node_modules_prod ] && mv node_modules_prod node_modules
npm install --production
npm prune --production

rm lambdaS3.zip
zip -r9 lambdaS3.zip ./ -x ".git/*" "test/*" "coverage/*" "deploy/*" "node_modules_dev/*"

mv node_modules node_modules_prod
[ -d node_modules_dev ] && mv node_modules_dev node_modules


# upload to aws

aws lambda update-function-code \
  --region $region \
  --function-name log-parsing-$1 \
  --zip-file fileb://lambdaS3.zip
