/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 16:24:14
 */
var Log =require('../util/log');
var env = require('../core/env');
var Base = require('../core/Base');
var log = new Log(5);

class Task extends Base {
    constructor(config){
        super();
        this.config = config;
        if (!this.config){
            throw new Error('Undefined taskConfig of <' + taskId + '>');
        }

    }
}

module.exports = Task;