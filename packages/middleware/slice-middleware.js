/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 01:15:53
 */
var Log =require('../util/log');

var log = new Log(5);

class Middleware{
    constructor (config) {
        // super(config);
        this.config = config || {};
        var partten = this.config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
        }
    }
    handle (string, next) {
        console.log(11111);
        if (Buffer.isBuffer(string)) string = string.toString();
        if (this.partten) {
            let arr = parttenSlice(this.partten, string);
            return next(arr);
        } else {
            return false;
            // & split 切割等待实现
        }
    }
}

function parttenSlice (partten, string) {
    var match = string.match(partten);
    return match || false;
}

module.exports = Middleware;