/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-24 18:34:38
 */
var Middleware = require('../middleware/middleware');

class SingelMiddleware extends Middleware{
    constructor (config) {
        config = config || {
            overwriteMode: false
        };
        super(config);
    }
    handle (string, next) {
        var result = {};
        result[this.config.name] = string.trim();
        return next(result);
    }
}

module.exports = SingelMiddleware;