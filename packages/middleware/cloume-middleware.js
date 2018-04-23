/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 16:10:35
 */
var Middleware = require('../middleware/middleware');

class CloumeMiddleware extends Middleware{
    constructor (config) {
        super(config);
        var partten = this.config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
            // console.log(this.partten);
        }
    }
    handle (string, next) {
        if (this.partten) {
            var kv = string.match(this.partten);
            if (kv && kv[1]){
                return next({
                    name: kv[1],
                    value: kv[2]
                });
            } else {
                return next(false);
            }
        } else {
            return next(false);
        }
    }

}

module.exports = CloumeMiddleware;