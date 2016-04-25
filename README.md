## package for processing api traffic

### apiaxle usage

configure which traffic processors apiaxle-proxy-event-subscriber uses in the stack.json file

run apiaxle-proxy without -q so that traffic gets passed to apiaxle-proxy-event-subscriber

example:
```
node apiaxle-proxy.js -f 1 -p 3000
node apiaxle-proxy-event-subscriber.js -f 1
```

### kinesis firehose to redshift

example command for delivery stream to copy to redshift:
```
COPY api_hits FROM 's3://<bucket-name>/<manifest>' CREDENTIALS 'aws_access_key_id=<aws-access-key-id>; aws_secret_access_key=<aws-secret-access-key>' MANIFEST DELIMITER ' ' TIMEFORMAT 'auto';
```
