/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-10 23:53:47
 */
var Log = require('../util/log');
var Base = require('../core/base');
var TimeFormatter = require('../formatter/formatter-time');

var log = new Log(5);

class Task extends Base {
    constructor(config){
        /**
         * {
         *      param: value
         *      config: current config
         * }
         */
        super();
        this.config = config;
        this.id = TimeFormatter.format('YYMMDDhhmmssms');
        
        if (!config){
            throw new Error('Undefined Task Config');
        }

    }

}
module.exports = Task;