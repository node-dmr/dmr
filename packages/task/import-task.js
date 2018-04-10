/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 21:01:06
 */
var Log =require('../util/log');
var config = require('../core/config');
var Task = require('../core/task');
var SourceFactory = require('../core/source-factory');
var file = require('../util/file');
var Time = require('../util/time');
var dtpl= require('../util/data-template');
var file = require('../util/file');
var fs  = require('fs');
// var Client = require('ftp');
var path = require('path');

var log = new Log(5);
	
class ImportTask extends Task{
    constructor(taskId){
        super('import', taskId);
    }
    setOutputFile (file) {
        if (file == 'default'){
            if (this.config["output-file"]) {
                file = path.resolve(config.root ,this.config["output-file"]);
            } else {
                throw new Error('No Default Output-file Config of Task!');
            }
        }
        this.outputFilePath = file;
    }

    getWriteStream (){
        var writer = process.stdout;
        if (this.outputFilePath){
            var pathParam = Time.parseParam(
                new Date(this.param.starttimestamp),
                new Date(this.param.endtimestamp)
            );
            var filePath = dtpl(this.outputFilePath, pathParam);
            // 获取文件目录，不存在则创建
            var baseUrl = path.dirname(filePath);
            if (!fs.existsSync(baseUrl)) {
                file.mkdirsSync(baseUrl);
            }
                
            // 如果文件创建成功则writer定向为文件写流
            writer = fs.createWriteStream(filePath, {
                encoding: 'utf8'
            });
            log.warn('L1', '[save] ' , filePath);
            writer.on('end',function(){
                console.log("WRITER END!");
            });
        }
        return writer;
    }


    checkRange (){
        var limitConfig = this.config["max-range"] || '1d';
        var interval = this.param.endtimestamp - this.param.starttimestamp;
        var limit = Time.parseInterval(limitConfig, 'ms');
        if (interval > limit * 1 ) {
            throw new Error('Please Reduce Range Param, max-range is ' + limitConfig);
            return false;
        }
        return true;
        
    }

    run (options) {
        var self = this;
        options = options || {};
        this.checkRange();
        var source = SourceFactory.createById(this.config.sourceId);
        source.setParams({
            "starttimestamp": this.param.starttimestamp,
            "endtimestamp": this.param.endtimestamp
        });
        source.pipe(this.getWriteStream());
        source.request();
        source.on('end', function(writer){
            // console.log('source download end', writer);
            self.emit('end');
        });
        return self;
    }
}



module.exports =  ImportTask;