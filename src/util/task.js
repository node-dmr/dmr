/*
 * @Author: qiansc
 * @Date: 2018-09-01 22:42:03
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-13 10:28:45
 */
class Task {
  /**
   * Task Interface
   * @interface Task
   * @param  {Object} [config = {}]
   */
  constructor(config) {
    this.config = config || {};
    this.option =  {};
  }
  /**
   * @param  {Object} option
   */
  setOptions(option) {
    this.option = option;
  }

  /**
   * run function shouled be  implemented
   * @function run
   * @name Task#run
   * @returns {Promise}
   */

}

module.exports = Task;
