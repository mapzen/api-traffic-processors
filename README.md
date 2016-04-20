## package for processing apiaxle traffic hits

### usage

run apiaxle-proxy without -q so that traffic gets passed to apiaxle-proxy-event-subscriber

set env var TRAFFIC_LOGFILE to a filepath that apiaxle-proxy-event-subscriber has write access to

run apiaxle-proxy-event-subscriber with -e requireable/path/to/traffic-processors

example:
```
node apiaxle-proxy.js -f 1 -p 3000
TRAFFIC_LOGFILE=/var/log/apiaxle-traffic-processors/traffic.log node apiaxle-proxy.js -f 1 -e /usr/local/lib/node_modules/traffic-processors/processors/apiaxleLog.js
```
