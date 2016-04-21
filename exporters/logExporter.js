var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function logExporter(logfile) {
  log4js.configure({
    appenders: [
      {
        type: 'file',
        layout: {
          type: 'messagePassThrough'
        },
        filename: logfile
      }
    ]
  });


  this.add = function (payload) {
    try {
      logger.info(payload);
    } catch (err) {
      console.error(err);
    }
  };
};
