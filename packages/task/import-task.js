/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-08 19:31:46
 */
var Log =require('../util/log');
var config = require('../core/config');
var ptpl= require('../util/param-template');
var Client = require('ftp');
var http = require('http');
var fs = require('fs');
var qs=require('querystring');
var log = new Log(5);
var taskConfigs = config && config.import && config.import.task;

module.exports =  downloadTask;

function downloadTask(taskId, param){
    this.taskConfig = config.import && config.import.task && config.import.task[taskId];
    var sourceId = this.taskConfig && this.taskConfig.source;
    this.sourceConfig = config.import && config.import.source && config.import.source[sourceId];
    if (!this.taskConfig || !this.sourceConfig){
        log.warn('L1', 'taskConfig' , this.taskConfig);
        log.warn('L1', 'sourceConfig ' , this.sourceConfig);
        throw new Error('Undefined taskConfig or sourceConfig of <' + taskId + '>');
    }
    this.param = param || {};
}

downloadTask.prototype.setParam = function (key, value) {
    this.param[key] = value;
}
downloadTask.prototype.setParams = function (json) {
    for (var key in json) {
        this.param[key] = json[key];
    }
}

downloadTask.prototype.start = function () {
    
    var paramTemplate = this.sourceConfig && this.sourceConfig.param || {};
    var param = ptpl(paramTemplate ,this.param);
    switch(this.sourceConfig.type){
        case "http":
                http_download.call(this, this.sourceConfig, param);
            break;
        default:
            break;
    }

}


function http_download(sourceConfig, param){
    var options = {
        hostname: sourceConfig.host, 
        port: sourceConfig.port, 
        path: sourceConfig.path + '?' + qs.stringify(param),
        method: sourceConfig.method || 'GET'
    }; 
    log.info('L9', 'url:', options.hostname + ':' + options.port + options.path);
    var req = http.request(options, function(res) { 
        log.info('L8', 'STATUS: ' + res.statusCode); 
        log.info('L8', 'HEADERS: ' + JSON.stringify(res.headers)); 
        
        res.setEncoding('utf8');
        
        res.on('data', function (chunk) { 
            log.info('L4','chunk data length ', chunk.length); 
        });
        
        res.on('end', () => {
            log.info('L8', '---------------------END-----------------------');
        });
    }); 
            
    req.on('error', function(e) { 
        log.info('problem with request: ' + e.message); 
    });
    log.info('L8', '--------------------START----------------------'); 
    req.end();

}