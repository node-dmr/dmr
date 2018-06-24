/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-21 23:04:31
 */
var fs = require('fs');
var path = require('path');
var Log = require('../util/log');
var Task = require('../task/task');
var Range = require('../util/range');
var Pipelines = require('../pipeline/pipelines');
var TimeFormatter = require('../formatter/formatter-time');
var InputSource = require('../source/source-input');
var SourceFactory = require('../source/factory');
var Connector = require('../pipeline/connector');


var log = new Log(5);

class SuperTask extends Task {
    constructor(config) {
        super(config);
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

    run(action) {
        log.warn('L1', 'ID\t', this.id);
        let outputInterval = action.oi || this.config["interval"] || this.config["output-interval"];
        let inputInterval = action.ii || this.config["interval"] || this.config["input-interval"];
        let range = new Range(action.range);
        let outputRanges = range.split(outputInterval);
        let inputRanges = range.split(inputInterval);
        if (inputRanges.length % outputRanges.length !== 0) {
            throw new Error(`Input has ${inputRanges.length} parts, can not be divided Output Interval ${outputInterval}`);
        }
        this.actions = [];
        outputRanges.forEach((range, index) => {
            this.actions.push(Object.assign({}, action, {
                range: range.param()
            }));
        });
        this.next();
    }

    next() {
        let action = this.actions.shift();
        let self = this,
            config = this.config;
        let writer;


        let inputSource = new InputSource(config["input-source"]);
        inputSource.setInterval(config["interval"] || config["input-interval"]);
        inputSource.on('create', function (file) {
            log.info('L1', 'INPUT \t', file);
        });
        let reader = inputSource.createReadStream(action);

        
        // this.checkRange();
        // 如果file存在则创建outputSource，传入配置，获取file-writer
        if (action.output == 'console' || !action.output) {

            writer = new Connector({
                readableObjectMode: true,
                writableObjectMode: true
            });
            if (action.output == 'console') {
                // 默认输出writer为控制台 disable的话不输出了
                writer.on('data', function (chunk) {
                    log.info(Buffer.isBuffer(chunk) ? chunk.toString() : chunk);
                });
            }
        } else if (action.output) {
            let outputSource = SourceFactory.create(config["output-source"]);
            outputSource.on('create', function (file) {
                log.info('L1', 'OUT \t', file);
            });
            writer = outputSource.createWriteStream(action);
            log.warn('L9', action);
            // writer.write(action.stringify()+'\n');
        }

        if (config["process"] && config["process"].length) {
            let process = new Pipelines(config["process"]);
            process.create(action);
            reader.pipe(process.writeable);
            process.readable.pipe(writer);
        } else {
            reader.pipe(writer);
        }


        log.time('Import last for');
        writer.on('finish', () => {
            if (this.actions.length) {
                this.next();
            } else {
                log.timeEnd('Import last for');
                this.emit('end');
                log.info('L5', '\r\nSucc\tSuccessful end!');
            }
        });

        return self;
    }
}



module.exports = SuperTask;