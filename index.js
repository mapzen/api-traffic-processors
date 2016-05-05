var configReader = require('./processors/readProcessorConfig.js');
var apiaxleKinesis = require('./processors/apiaxleKinesis.js');
var apiaxleLog = require('./processors/apiaxleLog.js');
var lambdaS3 = require('./processors/lambdaS3.js');

module.exports = {
  apiaxleKinesis: apiaxleKinesis,
  apiaxleLog: apiaxleLog,
  lambdaS3: lambdaS3(configReader('lambdaS3.json'))
};
