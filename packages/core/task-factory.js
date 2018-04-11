/*
 * @Author: qiansc 
 * @Date: 2018-04-11 13:15:41 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 16:11:17
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var ImportTask = require('../task/import-task.js');
var Config = require('../core/config.js');

var log = new Log(5);
class TaskFactory {
    static create(type, id){
        var config = Config.get('task', type, id);
        var task;
        switch (type){
            case 'import':
                task = new ImportTask(config);
                break;
            default :
                break;
        }
        return task;
    }
}

module.exports = TaskFactory;