/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 20:59:33
 */
var Log =require('../util/log');
var config = require('../core/config');
var EventEmitter = require('events');
var log = new Log(5);

class Task extends EventEmitter {
    constructor(){
        super();
        var arr = [].slice.call(arguments);
        var taskId = arr.pop();
        var con = config;
        for(var i = 0;i < arr.length; i++ ){
            con = con && con[arr[i]] || false;
        }
        this.config = con && con.task && con.task[taskId];

        if (!this.config){
            throw new Error('Undefined taskConfig of <' + taskId + '>');
        }
        this.param = {};
    }

    setParam (key, value) {
        this.param[key] = value;
    }
    setParams (json) {
        for (var key in json) {
            this.param[key] = json[key];
        }
    }
}

module.exports = Task;