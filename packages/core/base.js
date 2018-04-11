/*
 * @Author: qiansc 
 * @Date: 2018-04-11 14:25:23 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 17:06:26
 */
 var EventEmitter = require('events');
var Log = require('../util/log');

var log = new Log(5);

class Base extends EventEmitter{
    constructor () {
        super();
        this.option = {};
    }
    set (option, value) {
        if (value){
            this.option[option] = value;
        }else {
            this.option = Object.assign(this.option , option);
        }
        this.emit('set', this.option);
    }
}

module.exports = Base;