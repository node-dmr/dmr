/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 12:21:29
 */
var fs  = require('fs');
var path = require('path');
var Log =require('../util/log');
var Task = require('../core/task');
var SourceFactory = require('../core/source-factory');
var TimeFormatter = require('../formatter/time-formatter');
var TimeRangeFormatter = require('../formatter/time-range-formatter');

var log = new Log(5);

class ImportTask extends Task{
    constructor(config){
        super(config);
    }

    // 根据参数检测区间范围避免过大
    checkRange (){
        var limitConfig = this.config["max-range"] || '1d';
        var interval = this.option.endTimestamp - this.option.startTimeStamp;
        var limit = TimeFormatter.parseInterval(limitConfig, 'ms');
        if (interval > limit * 1 ) {
            throw new Error('Please Reduce Range Param, max-range is ' + limitConfig);
            return false;
        }
        return true;

    }

    run () {
        var self = this;
        this.checkRange();
        // 默认输出writer为控制台
        var writer = process.stdout;
        var formatter = new TimeRangeFormatter({
            "startTimeStamp": this.option.startTimeStamp,
            "endTimeStamp": this.option.endTimeStamp
        });

        // 如果file存在则创建fileSource，传入配置，获取file-writer
        if (this.option.file){
            var fileSource = SourceFactory.create(this.config["output-source"]);
            fileSource.setFilePathFormatter(formatter);
            writer = fileSource.createWriteStream(this.option.file);
        }
        
        var source = SourceFactory.create(this.config["input-source"]);
        source.setRequestParamFormatter(formatter);

        source.createReadStream().pipe(writer);
        source.on('end', function(writer){
            log.warn('L5', '[result] Successful end!');
            self.emit('end');
        });
        return self;
    }
}



module.exports =  ImportTask;