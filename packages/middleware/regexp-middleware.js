/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-24 17:40:10
 */
var Middleware = require('../middleware/middleware');

// var Log =require('../util/log');

// var log = new Log(5);

class RegexpMiddleWare extends Middleware{
    constructor (config) {
        super(config);
        var partten = this.config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
        }
    }
    handle (string, next) {
        // console.log('slice-middleware');
        let arr = [];
        if (Buffer.isBuffer(string)) string = string.toString();
        if (this.partten) {
            arr = parttenSlice(this.partten, string);
        } else if(this.config.separate){
            arr = string.split(this.config.separate);
            // & split 切割等待实现
        }
        var result = false;
        if (arr && arr[this.config.index] !== undefined && this.config.cloume) {
            result = {};
            result[this.config.cloume] = arr[this.config.index];
        }
        return next(result);
    }
}

function parttenSlice (partten, string) {
    var match = string.match(partten);
    return match || false;
}

module.exports = RegexpMiddleWare;