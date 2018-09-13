/*
 * @Author: qiansc
 * @Date: 2018-09-10 00:02:05
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-13 10:08:35
 */
const Moment = require('moment');
const Duration = Moment.duration;
const TaskInterface = require('./util/task');
// const Console = require('./util/console');
// const SourceFactory = require('./factory/source');
// const Source = require('dmr-source');
// const fs = require('fs');

class TaskSequence extends TaskInterface{
  /**
   * @param {Object} config
   * @param {Duration|String} [interval.interval] - interval of input & output
   * @param {Duration|String} [interval.input-interval] - interval of input
   * @param {Duration|String} [interval.output-interval] - interval of output
   */
  constructor (config) {
    config = config || {};
    super(config);
    this.oi = Duration(config['output-interval'] || config.interval);
    this.ii = Duration(config['input-interval'] || config.interval);
  }
  /**
   * @param  {Duration|String} duration - override input-interval
   */
  setInputInterval(duration) {
    this.ii = duration || this.ii;
  }

  /**
   * @param  {Duration|String} duration - override output-interval
   */
  setOutputInterval(duration) {
    this.oi = duration || this.oi;
  }

  /**
   * Set option of task
   * @param  {String} key
   * @param  {Object} value
   */
  setOption(key, value) {
    this.option[key] = value;
  }

  // /**
  //  * @private
  //  * @returns {WritableStream}
  //  */
  // _getOutput() {
  //   if (this.output === 'console') {
  //     return Console.stream;
  //   } else if (this.output === 'default') {
  //     if (this.config.output) {
  //       return SourceFactory.create(this.config.output);
  //     }
  //   } else if (typeof this.output === "string"){
  //     return SourceFactory.create({
  //       source: 'file',
  //       path: this.output
  //     });
  //   }
  //   return false;
  // }

  /**
   * Run Task
   * @param  {Range} range
   * @param  {Task} [Task=IOTask]
   * @returns {Promise}
   */
  run (range, Task) {
    if (!range || !range.isValid || !range.isValid()) {
      return Promise.reject('ERR501 - range is isValid');
    }
    let duration = range.duration().valueOf();
    let inputRanges = range.split(Duration(this.ii.valueOf() || duration));
    let outputRanges = range.split(Duration(this.oi.valueOf() || duration));

    if (inputRanges.length % outputRanges.length !== 0) {
      return Promise.reject(`ERR502 - Input has ${inputRanges.length} parts, can not be divided Output parts ${outputRanges.length}`)
    }
    // let outputSource = this._getOutput();

    // console.log(this.config.output);

    // cut into task according to length of outputRanges
    // each one outputRange match a task promise
    let promises = [];
    outputRanges.forEach(outputRange => {
      let task = new Task(this.config);
      task.setOptions(Object.assign({}, this.option, {
        ii: this.ii,
        range: outputRange
      }));
      promises.push(task.run());

      // let out =
      //   SourceFactory.isSource(outputSource) ?
      //   outputSource.createWritableStream({scope: {moment: or.start(), end: or.end(), duration: or.duration()}}) :
      //   outputSource;

      // let inputSource = SourceFactory.create(this.input);
      // let multi = new Source.MultiSource();
      // let ranges = or.split(Duration(this.ii.valueOf() || duration));

    });

    /**
     * let InputSource = new Multi();
     *
     *
     *
     */

    return Promise.all(promises);
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

module.exports = TaskSequence;
