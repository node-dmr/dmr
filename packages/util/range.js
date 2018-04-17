/*
 * @Author: qiansc
 * @Date: 2018-04-02 10:35:47 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 19:57:23
 * 时间范围Range模块
 */
var TimeFormatter = require('../formatter/time-formatter');
var Parameters = require('../core/parameters');

class Range extends Parameters{
    constructor (param) {
        param = Object.assign({
            startTimeStamp: null,
            endTimeStamp: null
        }, param);
        
        super(param);
    }
    setTimeStamp (startTimeStamp, endTimeStamp) {
        if (endTimeStamp) this.startTimeStamp = startTimeStamp;
        if (endTimeStamp) this.endTimeStamp = endTimeStamp;
    }
    setDatetime (startDatetime, endDatetime){
        startDatetime && this.setStartDatetime(startDatetime);
        endDatetime && this.setEndDatetime(endDatetime);
    }
    setStartDatetime  (datetime) {
        if(typeof datetime === 'string'){
            datetime = TimeFormatter.parseDatetime(datetime);
        }
        this.startTimeStamp = datetime.getTime();
    }

    setEndDatetime (datetime) {
        if(typeof datetime === 'string'){
            datetime = TimeFormatter.parseDatetime(datetime);
        }
        this.endTimeStamp = datetime.getTime();
    }

    setInterval (range) {
        if (!this.startTimeStamp) {
            throw new Error('You should set StartDatetime first!');
        }
        if (typeof range === 'string'){
            range = TimeFormatter.parseInterval(range);
        } else if(typeof range !=='number'){
            throw new Error('Invalid Range!');
            return;
        }
        this.endTimeStamp = this.startTimeStamp + range;
    }

    getInterval (){
        if(this.startTimeStamp && this.endTimeStamp) {
            return this.endTimeStamp - this.startTimeStamp;
        }
        throw new Error('startTimeStamp / endTimeStamp is Empty!');
    }

    // toJson () {
    //     return {
    //         startTimeStamp: this.startTimeStamp,
    //         endTimeStamp: this.endTimeStamp,
    //         interval: this.startTimeStamp - this.endTimeStamp
    //     }
    // }
    // parseJson (option) {
    //     this.startTimeStamp = option.startTimeStamp;
    //     this.endTimeStamp = option.endTimeStamp;
    // }

    toString (split) {
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
}

module.exports = Range;

