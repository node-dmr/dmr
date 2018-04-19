/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-19 17:26:23
 */
var Log =require('../util/log');
var Base = require('../core/base');
var ActionLog = require('../core/action-log');
var TimeFormatter = require('../formatter/time-formatter');
var RandomKey = require('../util/random-key');

var log = new Log(5);

class Task extends Base {
    constructor(action){
        super();
        this.action = action || {};
        this.id = TimeFormatter.format('YYMMDDhhmmssms');
        // FastKey
        this.key = new RandomKey().get();

        if (!action.config){
            throw new Error('Undefined taskConfig');
        }
        if (!action['task-type']){
            throw new Error('Undefined taskType');
        }
        this.on('end',() =>{
            ActionLog.add(this.key, this.id, action.stringify());
        });
    }

    // 暂时还不知道有什么样的需求，需要抽象run
    // run () {
    //     this.emit('start');
    // }
}
module.exports = Task;