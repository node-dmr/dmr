/*
 * @Author: qiansc
 * @Date: 2018-09-10 00:02:05
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-10 10:36:38
 */
const Moment = require('moment');
const Duration = Moment.duration;

class Tasks {

  constructor (config) {
    this.config = config;
    this.oi = Duration(config.get('output-interval') || config.get('interval'));
    this.ii = Duration(config.get('input-interval') || config.get('interval'));
  }

  setInputInterval(duration) {
    this.ii = duration || this.ii;
  }

  setOutputInterval(duration) {
    this.oi = duration || this.oi;
  }

  setInput(input) {

  }

  run () {

  }
}

module.exports = Tasks;
