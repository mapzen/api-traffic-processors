var configReader = require('./processors/readProcessorConfig.js');
var apiaxleToKinesis = require('./processors/apiaxleToKinesis.js');
var apiaxleLog = require('./processors/apiaxleLog.js');
var lambdaS3 = require('./processors/lambdaS3.js');

module.exports = {
  apiaxleToKinesis: apiaxleToKinesis,
  apiaxleLog: apiaxleLog,
  lambdaS3: lambdaS3(configReader('lambdaS3.json'))
};
