/*
 * @Author: qiansc 
 * @Date: 2018-04-17 20:14:34 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-02 17:23:04
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
        if (startDatetime.toString().indexOf('-') === 0) {
            let prev = TimeFormatter.parseInterval(startDatetime);
            startDatetime =  new Date(new Date().getTime() + prev * 1);
        } else {
            startDatetime = TimeFormatter.fillDatetime(startDatetime.replace(/[\-\:\\\.]/g,''));
            startDatetime = TimeFormatter.parseDatetime(startDatetime, 'HHHHMMDDhhmmss');
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
        endDatetime = TimeFormatter.fillDatetime(endDatetime.replace(/[\-\:\\]/g,''));
        endDatetime = TimeFormatter.parseDatetime(endDatetime, 'HHHHMMDDhhmmss');
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

    return range;
}