/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 17:19:12
 */
var Log =require('../util/log');
var env = require('../core/env');
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
    constructor(config){
        super(config);
        
        this.on('set', (option)=>{
            this.setOutputFile(option.file || false);
        });
    }

    setOutputFile (file) {
        if (file == 'default'){
            if (this.config["output-file"]) {
                file = path.resolve(env.root ,this.config["output-file"]);
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
                new Date(this.option.startTimeStamp),
                new Date(this.option.endTimeStamp)
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
        var interval = this.option.endTimestamp - this.option.startTimeStamp;
        var limit = Time.parseInterval(limitConfig, 'ms');
        if (interval > limit * 1 ) {
            throw new Error('Please Reduce Range Param, max-range is ' + limitConfig);
            return false;
        }
        return true;

    }

    run () {
        var self = this;
        this.checkRange();
        var source = SourceFactory.create('import', this.config.sourceId);
        source.set({
            "startTimeStamp": this.option.startTimeStamp,
            "endTimeStamp": this.option.endTimeStamp
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