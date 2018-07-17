/*
 * @Author: qiansc 
 * @Date: 2018-04-11 14:25:23 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-29 12:26:04
 */
const EventEmitter = require('events');
const Log = require('../util/log');

const log = new Log(5);

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