/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-24 17:42:32
 */
var Middleware = require('../middleware/middleware');

// var Log =require('../util/log');

// var log = new Log(5);

class PerformanceMiddleWare extends Middleware{
    constructor (config) {
        super(config);
    }
    handle (string, next) {
        return next({});
    }
}

module.exports = PerformanceMiddleWare;