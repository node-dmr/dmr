/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-02 09:08:11
 */
var Log = require('../util/log');
var Base = require('../core/base');
var ActionImplements = require('../core/action-implements');
var TimeFormatter = require('../formatter/formatter-time');

var log = new Log(5);

class Task extends Base {
    constructor(action){
        /**
         * {
         *      param: value
         *      config: current config
         * }
         */
        super();
        this.id = TimeFormatter.format('YYMMDDhhmmssms');

        ActionImplements.applyOn(this);
        this.setAction(action);
        // 开启action日志记录
        this.enableActionLog(this.id);

        if (!action.config){
            throw new Error('Undefined taskConfig');
        }

    }

}
module.exports = Task;