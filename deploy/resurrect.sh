#!/bin/bash

if [ "$#" -eq 0 ]; then
  echo "moves any accumulated logs in the s3 paused location to the live location so they get picked up by lambda"
  echo "example usage:"
  echo "$0 dev"
  exit 1
fi

if [ "$1" != "dev" -a "$1" != "prod" ]; then
  echo "param needs to be dev or prod"
  exit 1
fi

aws s3 mv --recursive s3://mapzen-fastly-logs/$1-logs-paused/vector/ s3://mapzen-fastly-logs/$1-logs/vector/
aws s3 mv --recursive s3://mapzen-fastly-logs/$1-logs-paused/vector/ s3://mapzen-fastly-logs/$1-logs/vector/
