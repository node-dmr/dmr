/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 16:03:44
 */
var Log =require('../util/log');
var Base = require('../core/Base');

var log = new Log(5);

class Task extends Base {
    constructor(action){
        super();
        this.action = action || {};
        if (!action.config){
            throw new Error('Undefined taskConfig');
        }
        if (!action['task-type']){
            throw new Error('Undefined taskType');
        }
    }

    // 暂时还不知道有什么样的需求，需要抽象run
    // run () {
    //     this.emit('start');
    // }
}

module.exports = Task;