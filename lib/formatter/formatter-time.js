/*
 * @Author: qiansc
 * @Date: 2018-04-02 14:43:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-12 11:17:52
 * Time相关的方法封装
 */
'use strict';

module.exports = {
    format: function (tpl, time){
        tpl = tpl || 'YYYYMMDDhhmmssms';
        time = time || new Date();
        return formatTime(tpl, time);
    },
    parseDatetime: function(datetimeString, partten){
        partten = partten || 'HHHH-MM-DD hh:mm:ss';
        partten = partten.replace(/HH|MM|DD|hh|mm|ss/g,'(\\d\\d)');
        partten =  new RegExp(partten);
        var matches = partten.exec(datetimeString);
        if(matches){
            return new Date(matches[1] + matches[2], matches[3] * 1 - 1, matches[4], matches[5], matches[6], matches[7]);
        }
        throw new Error('Invalid Datetime!');
    },
    parseDate: function(dateString, partten){
        partten = partten || 'HHHH-MM-DD';
        partten = partten.replace(/HHHH|MM|DD/g,'(\\d\\d)');
        partten =  new RegExp(partten);
        var matches = partten.exec(dateString);
        if(matches){
            return new Date(matches[1] + matches[2], matches[3] * 1 - 1, matches[4]);
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
function fixnumber(n,length) {
    length = length || 2;
    return [0,n].join('').slice(-1 * length);  
}  
function formatTime(format, curdate) {  
    if (format == undefined) return curdate;  
    format = format.replace(/YYYY/i, fixnumber(curdate.getFullYear(),4));
    format = format.replace(/YY/i, fixnumber(curdate.getFullYear(),2));  
    format = format.replace(/MM/i, fixnumber(curdate.getMonth() + 1));  
    format = format.replace(/DD/i, fixnumber(curdate.getDate()));  
    format = format.replace(/HH/i, fixnumber(curdate.getHours()));  
    format = format.replace(/mm/i, fixnumber(curdate.getMinutes()));  
    format = format.replace(/ss/i, fixnumber(curdate.getSeconds()));  
    format = format.replace(/ms/i, fixnumber(curdate.getMilliseconds(),3));  
    return format;  
}  