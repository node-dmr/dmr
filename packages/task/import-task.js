/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-09 21:55:12
 */
var Log =require('../util/log');
var config = require('../core/config');
var dtpl= require('../util/data-template');
var file = require('../util/file');
var Time = require('../util/time');
var Client = require('ftp');
var http = require('http');
var fs  = require('fs');
var qs=require('querystring');
var path = require('path');

var log = new Log(5);
const MAX_CHUNK_LOG_LINE= 20;
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
downloadTask.prototype.setFilePath = function (file) {
    if (file == 'default'){
        if (this.taskConfig.file) {
            this.targetFile = path.resolve(config.root ,this.taskConfig.file);
        }
        return;
    }
    this.targetFile = file;
}
downloadTask.prototype.getFilePath = function (file) {
    // options.file || this.taskConfig.file
    //this.targetFile = file;
    return this.targetFile;
}
downloadTask.prototype.start = function (options) {
    options = options || {};
    var paramTemplate = this.sourceConfig && this.sourceConfig.param || {};
    var param = dtpl(paramTemplate, this.param);
    var filePath = this.getFilePath();
    var filePathParam = Time.parseParam(
        new Date(this.param.starttimestamp),
        new Date(this.param.endtimestamp)
    );
    this.checkRange();
    switch(this.sourceConfig.type){
        case "http":
                httpDownload(this.sourceConfig , {
                    param: param,
                    filePath: dtpl(filePath, filePathParam)
                });
            break;
        default:
            break;
    }

}

downloadTask.prototype.checkRange = function(){
    var limitConfig = this.taskConfig["max-range"] || '1d';
    var interval = this.param.endtimestamp - this.param.starttimestamp;
    var limit = Time.parseInterval(limitConfig, 'ms');
    if (interval > limit * 1 ) {
        throw new Error('Please Reduce Range Param, max-range is ' + limitConfig);
        return false;
    }
    return true;
    
}

function httpDownload(sourceConfig, options){
    options = options || {};
    var opt = {
        hostname: sourceConfig.host, 
        port: sourceConfig.port, 
        path: sourceConfig.path + '?' + qs.stringify(options.param),
        method: sourceConfig.method || 'GET'
    }; 
    log.info('L5', '[from] ' , opt.hostname + ':' + opt.port + opt.path);
    var writer;
    var filePath = options.filePath;
    if (filePath) {
        // 获取文件目录，不存在则创建
        var baseUrl = path.dirname(filePath);
        if (!fs.existsSync(baseUrl)) {
            file.mkdirsSync(baseUrl);
        }
        
        //创建writer
        var writer = fs.createWriteStream(filePath, {
            encoding: 'utf8'
        });
        log.warn('L1', '[ to ] ' , filePath);
    }
    var req = http.request(opt, function(res) { 
        log.info('L8', 'STATUS: ' + res.statusCode); 
        log.info('L8', 'HEADERS: ' + JSON.stringify(res.headers)); 
        
        res.setEncoding('utf8');
        
        res.on('data', function (chunk) {
                if (writer){
                    writer.write(chunk);
                } else {
                    // 直接打印至控制台
                    log.info('L0', chunk); 
                }
            
        });

        res.on('end', () => {
            log.info('L8', '---------------------END-----------------------');
            if (writer) {
                writer.end();
            }
        });
    }); 
            
    req.on('error', function(e) { 
        log.warn('problem with request: ' + e.message); 
    });
    log.info('L8', '--------------------START----------------------'); 
    req.end();
}
