/*
 * @Author: qiansc 
 * @Date: 2018-04-17 20:14:34 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 11:40:25
 */
var TimeFormatter = require('../../packages/formatter/time-formatter');
var Log = require('../../packages/util/log');
var Range = require('../../packages/util/range');
var TaskFactory = require('../../packages/core/task-factory');
var log = new Log(2);

module.exports = function(program) {

    var taskId = program.task || false;
    var startDatetime = program.start || false;
    var endDatetime = program.end || false;
    var rangeString = program.range || false;
    var key = program.key || false;
    var range = new Range();
    var taskConfig = TaskFactory.getConfig('import', taskId);

    if (startDatetime) {
        if (startDatetime.toString().indexOf('-') === 0) {
            var prev = TimeFormatter.parseInterval(startDatetime);
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
            if (taskConfig.interval){
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