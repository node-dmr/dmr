/*
 * @Author: qiansc 
 * @Date: 2018-04-11 13:15:41 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 21:03:41
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var ImportTask = require('../task/task-import.js');
var TransferTask = require('../task/task-transfer.js');
var CalculateTask = require('../task/task-calculate.js');
var Config = require('../core/config.js');

var log = new Log(5);
class TaskFactory {
    static create (type, id) {
        var action, config, task;
        
        if (typeof type === "object"){
            action = type;
            type = action['task-type'];
            id = action['task-id'];
            config = action.config || false;
        }
        if (!config){
            action["config"] = config = Config.get('task', type, id);
        }
        switch (type){
            case 'import':
                task = new ImportTask(action);
                break;
            case  'transfer':
                task = new TransferTask(action);
                break;
            case 'calculate':
                task = new CalculateTask(action);
                break;
            default:
                break;
        }
        return task;
    }
    static getConfig (type, id) {
        return Config.get('task', type, id);
    }
}

module.exports = TaskFactory;