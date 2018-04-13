/*
 * @Author: qiansc 
 * @Date: 2018-04-13 11:34:45 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 14:00:25
 */
var Formatter = require('../core/formatter');
var TimeFormatter = require('../formatter/time-formatter');
var TimeFormatter = require('./time-formatter');
var dtpl= require('../util/data-template');

class TimeRangeFormatter extends Formatter {
    constructor (option) {
        super(option);
    }
    /**
     * @param {string|object} 
     * support format string or object , following fields will be replaced:
     * YYYY/MM/DD/hh/mm/ss/ms |  interval{s/m/h/d} | startTimeStamp/endTimeStamp
     */
    format (string){
        
        var timeParam = TimeRangeFormatter.parseRange(
            new Date(this.option.startTimeStamp),
            new Date(this.option.endTimeStamp)
        );
        timeParam.startTimeStamp = this.option.startTimeStamp;
        timeParam.endTimeStamp = this.option.endTimeStamp;
        
        return dtpl(string, timeParam);
    }

    static parseRange (date, endDate){
        var param ={
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
          }
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


module.exports = TimeRangeFormatter;