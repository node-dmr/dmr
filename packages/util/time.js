/*
 * @Author: qiansc
 * @Date: 2018-04-02 14:43:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-09 21:27:39
 * Time相关的方法封装
 */
'use strict';

module.exports = {
    parseDatetime: function(datetimeString, partten){
        partten = partten || 'HHHH-MM-DD hh:mm:ss';
        partten = partten.replace(/HH|MM|DD|hh|mm|ss/g,'(\\d\\d)');
        partten =  new RegExp(partten);
        var matches = partten.exec(datetimeString);
        if(matches){
            return new Date(matches[1] + matches[2], matches[3], matches[4], matches[5], matches[6], matches[7]);
        }
        throw new Error('Invalid Datetime!');
    },
    parseDate: function(dateString, partten){
        partten = partten || 'HHHH-MM-DD';
        partten = partten.replace(/HHHH|MM|DD/g,'(\\d\\d)');
        partten =  new RegExp(partten);
        var matches = partten.exec(dateString);
        if(matches){
            return new Date(matches[1] + matches[2], matches[3], matches[4]);
        }
        throw new Error('Invalid Date!');
    },
    fillDatetime: function(datetime){
        if (datetime && datetime.length === 8){
            // 20180301
            return datetime + '000000';
        } else if (datetime && datetime.length === 12){
            // 20180301 1200
            return datetime + '00';
        } else if (datetime && datetime.length === 14){
          // 20180301 1200 00
            return datetime;
        }
        throw new Error('datetime ' + datetime + ' is illegal !');
        return;
    },
    /*
    * @Author: nescalante
    * @Github: https://github.com/nescalante/timeparse
    * @Examples:
        var timeparse = require('timeparse');
        var result = timeparse('2m2s'); // 122000 (2 minutes and 2 seconds in milliseconds)
        var result2 = timeparse('3m43s', 's') //223 (3 minutes, 43 seconds in seconds)
        var result3 = timeparse('46.30ms', 'μs') //46300
      @Units
        w: weeks
        d: days
        h: hours
        m: minutes
        s: seconds
        ms: milliseconds
        μs: microseconds
    */
    parseInterval: function (string, returnUnit) {
        returnUnit = returnUnit || 'ms';
        var totalMicroseconds = 0;
        var groups = string
          .toLowerCase()
          .match(/[-+]?[0-9\.]+[a-z]+/g);
        if (groups !== null) {
          groups.forEach(function (g) {
            var value = g.match(/[0-9\.]+/g)[0];
            var unit = g.match(/[a-z]+/g)[0];
            totalMicroseconds += getMicroseconds(value, unit);
          });
        }
        var prfix = string.indexOf('-') === 0 ? -1 : 1;
        return prfix * totalMicroseconds / units[returnUnit];
      },
      parseParam: function (date, endDate){
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
                "s": this.parseInterval(interval, "s"),
                "m": this.parseInterval(interval, "m"),
                "h": this.parseInterval(interval, "h"),
                "d": this.parseInterval(interval, "d")
            }
        }
        return param;
      }
}

var units = {
    μs : 1,
    ms : 1000,
    s  : 1000 * 1000,
    m  : 1000 * 1000 * 60,
    h  : 1000 * 1000 * 60 * 60,
    d  : 1000 * 1000 * 60 * 60 * 24,
    w  : 1000 * 1000 * 60 * 60 * 24 * 7
  };

function getMicroseconds(value, unit) {
  var result = units[unit];

  if (result) {
    return value * result;
  }

  throw new Error('The unit "' + unit + '" could not be recognized');
}

function autoCompleteNumber(number, length){
    number = number.toString();
    if (number.length >= length){
        return number.substring(0, length);
    } else {
        return new Array(length - number.length + 1).join("0") + number;
    }
}