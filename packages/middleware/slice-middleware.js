/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-20 20:10:18
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
    handle (string) {
        if (Buffer.isBuffer(string)) string = string.toString();
        if (this.partten) {
            return parttenSlice(this.partten, string);
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