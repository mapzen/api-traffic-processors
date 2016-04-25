## package for processing api traffic

### apiaxle usage

run apiaxle-proxy without -q so that traffic gets passed to apiaxle-proxy-event-subscriber

example:
```
node apiaxle-proxy.js -f 1 -p 3000
```

set env vars to whatever the processor needs.

run apiaxle-proxy-event-subscriber with -e requireable/path/to/traffic-processor -e another/processor


log example:
```
TRAFFIC_LOGFILE=/var/log/apiaxle-traffic-processors/traffic.log node apiaxle-proxy.js -f 1 -e /usr/local/lib/node_modules/api-traffic-processors/processors/apiaxleLog.js
```

kinesis example:
```
FIREHOSE_STREAM=the_stream_name node apiaxle-proxy.js -f 1 -e /usr/local/lib/node_modules/api-traffic-processors/processors/apiaxleKinesis.js
```

### kinesis firehose to redshift

example command for delivery stream to copy to redshift:
```
COPY api_hits FROM 's3://<bucket-name>/<manifest>' CREDENTIALS 'aws_access_key_id=<aws-access-key-id>; aws_secret_access_key=<aws-secret-access-key>' MANIFEST DELIMITER ' ' TIMEFORMAT 'auto';
```
