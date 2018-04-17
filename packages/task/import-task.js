/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 16:16:30
 */
var fs  = require('fs');
var path = require('path');
var Log =require('../util/log');
var Task = require('../core/task');
var SourceFactory = require('../core/source-factory');
var TimeFormatter = require('../formatter/time-formatter');

var log = new Log(5);

class ImportTask extends Task{
    constructor(action){
        super(action);
    }

    // 根据参数检测区间范围避免过大
    checkRange (){
        var limitConfig = this.action.config["max-range"] || '1d';
        var limit = TimeFormatter.parseInterval(limitConfig, 'ms');
        var interval = this.action.range.endTimeStamp - this.action.range.startTimeStamp;
        if (interval > limit * 1 ) {
            throw new Error('Please Reduce Range Param, max-range is ' + limitConfig);
            return false;
        }
        return true;

    }
    
    run () {
        var self = this,
            action =  this.action,
            config = this.action.config;
        // 默认输出writer为控制台
        var writer = process.stdout;
            
        this.checkRange();

        // 如果file存在则创建fileSource，传入配置，获取file-writer
        if (action.file){
            var fileSource = SourceFactory.create(config["output-source"]);
            fileSource.set('range', action.range);
            fileSource.set('file', action.file);
            writer = fileSource.createWriteStream();
            log.warn('L9', JSON.stringify(action.stringify())+'\n');
            writer.write(JSON.stringify(action.stringify())+'\n');
        }
        
        var importSource = SourceFactory.create(config["input-source"]);
        importSource.set('range', action.range);
        importSource.createReadStream().pipe(writer);
        
        importSource.on('end', function(){
            log.warn('L5', '[result] Successful end!');
            self.emit('end', fileSource);
        });
        
        return self;
    }
}



module.exports =  ImportTask;