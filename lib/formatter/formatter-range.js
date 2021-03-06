/*
 * @Author: qiansc 
 * @Date: 2018-04-13 11:34:45 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-25 20:29:09
 */
var Formatter = require('../formatter/formatter');
var TimeFormatter = require('./formatter-time');
var dtpl= require('../util/data-template');

class RangeFormatter extends Formatter {
    constructor (range) {
        super();
        this.range = range;
    }
    /**
     * @param {string|object} 
     * support format string or object , following fields will be replaced:
     * YYYY/MM/DD/hh/mm/ss/ms |  interval{s/m/h/d} | startTimeStamp/endTimeStamp
     */
    format (string){
        var timeParam = this.toParam();
        return dtpl(string, timeParam);
    }


    toParam (){
        var date = new Date(this.range.startTimeStamp);
        var endDate = new Date(this.range.endTimeStamp);
        var param ={
          "startTimeStamp": this.range.startTimeStamp,
          "endTimeStamp": this.range.endTimeStamp,
          "YYYY": autoCompleteNumber(date.getFullYear(), 4),
          "MM": autoCompleteNumber(date.getMonth() + 1, 2),
          "DD": autoCompleteNumber(date.getDate(), 2),
          "hh": autoCompleteNumber(date.getHours(), 2),
          "mm": autoCompleteNumber(date.getMinutes(), 2),
          "ss": autoCompleteNumber(date.getSeconds(), 2),
          "ms": autoCompleteNumber(date.getMilliseconds(), 3)
        };
        if (endDate) {
            var interval = (endDate.getTime() - date.getTime()).toString() + "ms";
            param.interval = {
                "s": TimeFormatter.parseInterval(interval, "s"),
                "m": TimeFormatter.parseInterval(interval, "m"),
                "h": TimeFormatter.parseInterval(interval, "h"),
                "d": TimeFormatter.parseInterval(interval, "d")
            };
            ["d", "h", "m", "s"].forEach(t => {
                if (isInteger(param.interval[t])) {
                    param.interval.auto = param.interval.auto || t;
                }
            });
            param.interval.auto = param.interval.auto || 's';
        }
        return param;
    }

}

function autoCompleteNumber(number, length){
    number = number.toString();
    if (number.length >= length){
        return number.substring(0, length);
    } else {
        return new Array(length - number.length + 1).join("0") + number;
    }
}
function isInteger(obj){  
    return  Math.round(obj) === obj;

}  

module.exports = RangeFormatter;