/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-04 15:25:17
 */
var fs  = require('fs');
var path = require('path');
var Log =require('../util/log');
var Task = require('../task/task');
var SourceFactory = require('../source/factory');
var Pipelines = require('../pipeline/pipelines');
var TimeFormatter = require('../formatter/formatter-time');

var log = new Log(5);

class SuperTask extends Task{
    constructor(action){
        super(action);
    }

    // 根据参数检测区间范围避免过大
    // checkRange (){
    //     var limitConfig = this.config["max-range"] || '1d';
    //     var limit = TimeFormatter.parseInterval(limitConfig, 'ms');
    //     var interval = this.actionParam.range.endTimeStamp - this.actionParam.range.startTimeStamp;
    //     if (interval > limit * 1 ) {
    //         throw new Error('Please Reduce Range Param, max-range is ' + limitConfig);
    //         return false;
    //     }
    //     return true;

    // }
    
    run () {
        let self = this,
            actionParam =  this.actionParam,
            config = this.config;
        // 默认输出writer为控制台
        let writer = process.stdout;
        // var range = actionParam.range;
            
        // this.checkRange();
        log.warn('L1', 'ID\t' , this.id);
        // 如果file存在则创建outputSource，传入配置，获取file-writer
        if (actionParam.file){
            let outputSource = SourceFactory.create(config["output-source"]);
            outputSource.setActionParam(actionParam);
            outputSource.on('create', function (file) {
                log.warn('L1', 'FILE\t' , file);
            });

            writer = outputSource.createWriteStream();
            log.warn('L9',actionParam);
            // writer.write(action.stringify()+'\n');
        }
        
        let inputSource = SourceFactory.create(config["input-source"]);
        inputSource.setActionParam(actionParam);
        let reader = inputSource.createReadStream();

        if (config["input-process"] && config["input-process"].length) {
            let inputProcess = new Pipelines(config["input-process"]);
            inputProcess.setActionParam(actionParam);
            inputProcess.create();
            reader.pipe(inputProcess.writeable);
            inputProcess.readable.pipe(writer);
        } else {
            reader.pipe(writer);
        }



        log.time('Import last for');
        writer.on('finish', function(){
            log.timeEnd('Import last for');
            self.emit('end');
            log.info('L5', '\r\nSucc\tSuccessful end!');
        });
        
        return self;
    }

    process(input) {

    }
}



module.exports =  SuperTask;