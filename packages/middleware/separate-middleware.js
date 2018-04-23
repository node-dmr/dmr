/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 18:28:13
 */
var Middleware = require('../middleware/middleware');

// var Log =require('../util/log');

// var log = new Log(5);

class SeparateMiddleware extends Middleware{
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
        if (Buffer.isBuffer(string)) string = string.toString();
        if (this.partten) {
            let arr = parttenSlice(this.partten, string);
            return next(arr);
        } else {
            return next(false);
            // & split 切割等待实现
        }
    }
}

function parttenSlice (partten, string) {
    var match = string.match(partten);
    return match || false;
}

module.exports = SeparateMiddleware;