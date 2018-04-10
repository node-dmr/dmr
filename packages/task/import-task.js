/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 17:20:23
 */
var Log =require('../util/log');
var config = require('../core/config');
var Task = require('../core/task');
var Source = require('../core/source');
var file = require('../util/file');
var Time = require('../util/time');
// var Client = require('ftp');
var path = require('path');

var log = new Log(5);
	
class ImportTask{
    constructor(taskId){
        this.taskConfig = config.import && config.import.task && config.import.task[taskId];
        //this.sourceConfig = config.import && config.import.source && config.import.source[sourceId];
        if (!this.taskConfig){
            log.warn('L1', 'taskConfig' , this.taskConfig);
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
    setFilePath (file) {
        if (file == 'default'){
            if (this.taskConfig.file) {
                this.targetFile = path.resolve(config.root ,this.taskConfig.file);
            }
            return;
        }
        this.targetFile = file;
    }
    getFilePath (file) {
        return this.targetFile;
    }

    start (options) {
        options = options || {};
        var filePath = this.getFilePath();

        this.checkRange();
        var source = Source.creatById(this.taskConfig.sourceId);
        source.setParams({
            "starttimestamp": this.param.starttimestamp,
            "endtimestamp": this.param.endtimestamp
        });
        source.saveTo(this.getFilePath());
        source.start();
        
    }

    checkRange (){
        var limitConfig = this.taskConfig["max-range"] || '1d';
        var interval = this.param.endtimestamp - this.param.starttimestamp;
        var limit = Time.parseInterval(limitConfig, 'ms');
        if (interval > limit * 1 ) {
            throw new Error('Please Reduce Range Param, max-range is ' + limitConfig);
            return false;
        }
        return true;
        
    }
}



module.exports =  ImportTask;