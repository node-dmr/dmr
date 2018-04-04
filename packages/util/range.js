/*
 * @Author: qiansc
 * @Date: 2018-04-02 10:35:47 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-04 12:59:33
 * 时间范围Range模块
 */
var Time = require('./time');

function Range (startDatetime, endDatetime) {
    this.startTimeStamp = null;
    this.endTimeStamp = null;

    if (startDatetime && startDatetime.toString().length === 13) {
        this.startTimeStamp = startDatetime;
    } else if(startDatetime) {
        this.setStartDatetime(startDatetime);
    }

    if (endDatetime && endDatetime.toString().length === 13) {
        this.startTimeStamp = startDatetime;
    } else if (endDatetime) {
        this.setEndDatetime(endDatetime);
    }
}
Range.prototype.setStartDatetime =function (datetime) {
    if(typeof datetime === 'string'){
        datetime = Time.parseDatetime(datetime);
    }
    this.startTimeStamp = datetime.getTime();
}

Range.prototype.setEndDatetime =function (datetime) {
    if(typeof datetime === 'string'){
        datetime = Time.parseDatetime(datetime);
    }
    this.endTimeStamp = datetime.getTime();
}

Range.prototype.setRange = function (range) {
    if (!this.startTimeStamp) {
        throw new Error('You should set StartDatetime first!');
    }
    if (typeof range === 'string'){
        range = Time.parse(range);
    } else if(typeof range !=='number'){
        throw new Error('Invalid Range!');
        return;
    }
    this.endTimeStamp = this.startTimeStamp + range;
}

Range.prototype.toString = function (split) {
    if(this.startTimeStamp && this.endTimeStamp) {
        var arr = [
            'From ' + new Date(this.startTimeStamp).toString() + ' ',
            'To ' + new Date(this.endTimeStamp).toString() + ' ',
            'Range ' + (this.endTimeStamp - this.startTimeStamp) + ' ms'
        ]
        return arr.join(split || '');
    } else {
        return 'Invalid Range!';
    }
}

Range.prototype.getRangeStamp = function(){
    if(this.startTimeStamp && this.endTimeStamp) {
        return this.endTimeStamp - this.startTimeStamp;
    }
    throw new Error('startTimeStamp / endTimeStamp is Empty!');
}

module.exports = Range;