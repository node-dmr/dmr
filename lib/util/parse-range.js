/*
 * @Author: qiansc 
 * @Date: 2018-04-17 20:14:34 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 01:40:38
 */
const TimeFormatter = require('../formatter/formatter-time');
const Log = require('../util/log');
const Range = require('../util/range');
const Config = require('../core/config.js');
const log = new Log(2);

module.exports = function(program) {
    let taskId = program.task || false;
    let startDatetime = program.start || false;
    let endDatetime = program.end || false;
    let rangeString = program.range || false;
    let key = program.key || false;
    let range = new Range();
    let taskConfig = Config.find('task',taskId);
    if (startDatetime) {
        // 20180901+12h
        let matches = startDatetime.match(/^(.*)([\+\-]\d+[a-z])$/);
        let prev = false;
        if (matches) {
            startDatetime = matches[1];
            prev =  matches[2];
        }
        // now
        if (startDatetime.indexOf('now') === 0) {
            startDatetime = new Date();
        } else {
            startDatetime = TimeFormatter.fillDatetime(startDatetime.replace(/[\-\:\\\.]/g,''));
            startDatetime = TimeFormatter.parseDatetime(startDatetime, 'HHHHMMDDhhmmss');
        }
        if (prev) {
            prev = TimeFormatter.parseInterval(prev);
            startDatetime =  new Date(startDatetime.getTime() + prev * 1);
        }
        range.setStartDatetime(startDatetime);
    } else if(!key){
        log.info('Start Date / Datetime is required!');
        return;
    }
    if(key){

    }else if((endDatetime && rangeString) || (!endDatetime && !rangeString)) {
        log.info('You Should choose Option between  End Datetime / Ranges!');
        return;
    }
    if (endDatetime) {
        let matches = endDatetime.match(/^(.*)([\+\-]\d+[a-z])$/);
        let prev = false;
        if (matches) {
            endDatetime = matches[1];
            prev =  matches[2];
        }
        if (endDatetime.indexOf('now') === 0) {
            endDatetime = new Date();
        } else {
            endDatetime = TimeFormatter.fillDatetime(endDatetime.replace(/[\-\:\\\.]/g,''));
            endDatetime = TimeFormatter.parseDatetime(endDatetime, 'HHHHMMDDhhmmss');
        }
        if (prev) {
            prev = TimeFormatter.parseInterval(prev);
            endDatetime =  new Date(endDatetime.getTime() + prev * 1);
        }
        range.setEndDatetime(endDatetime);
    }
    if (rangeString) {
        if (rangeString === "default"){
            if (taskConfig["input-interval"]) {
                rangeString = taskConfig["input-interval"];
            } else if (taskConfig.interval){
                // 如果默认配置有interval
                rangeString = taskConfig.interval;
            } else {
                log.info('No Default Interval Config Of Range!');
            }
        }
        range.setInterval(rangeString);
    }

    // if (offset) {
    //     console.log(offset);
    //     offset = TimeFormatter.parseInterval(offset);
    //     console.log(offset);
    //     range.startTimeStamp += offset;
    //     range.endTimeStamp += offset;
    // }

    return range;
}