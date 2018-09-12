/*
 * @Author: qiansc
 * @Date: 2018-09-10 00:02:05
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-12 19:31:24
 */
const Moment = require('moment');
const Duration = Moment.duration;
const Console = require('./util/console');
const SourceFactory = require('./factory/source');
const Source = require('dmr-source');
const fs = require('fs');

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
   * - default Use config
   * - path File
   * @param  {string|path} input - publish
   */
  setInput(input) {
    this.input = input;
  }
  /**
   * @private
   * @returns {ReadableStream}
   */
  getInputSource() {

  }

  /**
   * set Output
   * - console Use cmd console
   * - default Use config
   * - path File
   * @param  {string|path} input - publish
   */
  setOutput(output) {
    this.output = output;
  }

  /**
   * @private
   * @returns {WritableStream}
   */
  _getOutput() {
    if (this.output === 'console') {
      return Console.stream;
    } else if (this.output === 'default') {
      if (this.config.output) {
        return SourceFactory.create(this.config.output);
      }
    } else if (typeof this.output === "string"){
      return SourceFactory.create({
        source: 'file',
        path: this.output
      });
    }
    return false;
  }

  run (range) {
    if (!range || !range.isValid()) {
      return Promise.reject('ERR501 - range is isValid');
    }
    let duration = range.duration().valueOf();
    let inputRanges = range.split(Duration(this.ii.valueOf() || duration));
    let outputRanges = range.split(Duration(this.oi.valueOf() || duration));

    if (inputRanges.length % outputRanges.length !== 0) {
      return Promise.reject(`ERR502 - Input has ${inputRanges.length} parts, can not be divided Output parts ${outputRanges.length}`)
    }
    // console.log(inputRanges.length, outputRanges.length);
    let outputSource = this._getOutput();

    console.log(this.config.output);
    return Promise.resolve();
    // cut into task according to length of outputRanges
    // each one outputRange match a task promise
    outputRanges.forEach(or => {
      let out =
        SourceFactory.isSource(outputSource) ?
        outputSource.createWritableStream({scope: {moment: or.start(), end: or.end(), duration: or.duration()}}) :
        outputSource;

      let inputSource = SourceFactory.create(this.input);
      let multi = new Source.MultiSource();
      let ranges = or.split(Duration(this.ii.valueOf() || duration));
      let promises = [];
      ranges.forEach(ir => {
        multi.addSource(inputSource, {scope:ir});
      });

    });

    /**
     * let InputSource = new Multi();
     *
     *
     *
     */

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
