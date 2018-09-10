/*
 * @Author: qiansc
 * @Date: 2018-09-10 00:02:05
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-10 23:09:03
 */
const Moment = require('moment');
const Duration = Moment.duration;

class Tasks {

  constructor (config) {
    this.config = config;
    this.oi = Duration(config['output-interval'] || config.interval);
    this.ii = Duration(config['input-interval'] || config.interval);
  }

  setInputInterval(duration) {
    this.ii = duration || this.ii;
  }

  setOutputInterval(duration) {
    this.oi = duration || this.oi;
  }

  /**
   * set Input
   * - console Use cmd console
   * - default Use config
   * - path File
   * @param  {string|path} input - publish
   */
  setInput(input) {
    this.input = input;
  }

  setOutput(output) {
    this.output = output;
  }

  run (range) {
    if (!range || !range.isValid()) {
      return Promise.reject('range is isValid');
    }

    let duration = range.duration().as('ms');
    let ii = this.ii.as('ms') || duration;
    let oi = this.oi.as('ms') || duration;

    return Promise.resolve();
  }

  // log.warn('L1', 'ID\t', this.id);
  // let outputInterval = action.oi || this.config["interval"] || this.config["output-interval"];
  // let inputInterval = action.ii || this.config["interval"] || this.config["input-interval"];
  // let range = new Range(action.range);
  // let outputRanges = range.split(outputInterval);
  // let inputRanges = range.split(inputInterval);
  // if (inputRanges.length % outputRanges.length !== 0) {
  //     throw new Error(`Input has ${inputRanges.length} parts, can not be divided Output Interval ${outputInterval}`);
  // }
  // this.actions = [];
  // outputRanges.forEach((range, index) => {
  //     this.actions.push(Object.assign({}, action, {
  //         range: range.param()
  //     }));
  // });
}

module.exports = Tasks;
