## Package for processing api traffic

![diagram](https://cloud.githubusercontent.com/assets/5049698/16020943/2eeb9e3c-317e-11e6-867b-56bd97b707d5.png)

## Installing
clone package and run `npm install`

## Testing
```npm test```

## Package Structure

#### Processors
Entry points are called "processors" and are exposed in index.js.

A processor obtains raw input, and sends it through parser -> formatter -> exporter

#### Parsers
Parsers convert raw input into parsed records for a formatter to handle.

Each parser has a matching fixture file in test/fixtures and its test file will make sure each line is parsed into the correct format.

#### Formatters
Formatters convert parsed records into a specific format for logging/importing to redshift/etc.

#### Exporters
Exporters should be created with "new" and have .add(record) and .addBatch(records) methods

## Apiaxle Usage

tell apiaxle to 'require' apiaxleKinesis.js or apiaxleLog.js by adding to apiaxle.traffic_processors in the stack.json in https://github.com/mapzen/opsworks-apiaxle

If you're running apiaxle locally, you can accomplish the same thing by adding to the "traffic_processors" section of the apiaxle.json config file, and then be sure to run apiaxle-proxy without -q so that traffic gets passed to apiaxle-proxy-event-subscriber.

example:
```
node apiaxle-proxy.js -f 1 -p 3000
node apiaxle-proxy-event-subscriber.js -f 1
```

## Kinesis Firehose to Redshift

example command for delivery stream to copy to redshift:
```
COPY api_hits FROM 's3://<bucket-name>/<manifest>' CREDENTIALS 'aws_access_key_id=<aws-access-key-id>; aws_secret_access_key=<aws-secret-access-key>' MANIFEST DELIMITER ' ' TIMEFORMAT 'auto';
```
