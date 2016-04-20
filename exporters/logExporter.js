var log4js = require('log4js');

module.exports = function(logfile) {
  log4js.configure({
    appenders: [
      {
        type: 'file',
        layout: {
          type: 'messagePassThrough',
        },
        filename: logfile,
      },
    ]
  });

  var logger = log4js.getLogger();

  this.add = function(payload) {
    try {
      logger.info(payload);
    } catch (err) {
      console.log(err);
    }
  };
};
