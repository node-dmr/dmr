/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 20:44:53
 */
var Middleware = require('../middleware/middleware');

class ColumnMiddleware extends Middleware{
    constructor (config) {
        super(config);
        var partten = this.config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
            // console.log(this.partten);
        }
        this.prefix = this.config.prefix || '';
    }
    handle (string, next) {
        if (this.partten) {
            var kv = string.match(this.partten);
            if (kv && kv[1]){
                let rs= {};
                rs[this.prefix + kv[1]] = kv[2];
                return next(rs);
            } else {
                return next(false);
            }
        } else {
            return next(false);
        }
    }

}

module.exports = ColumnMiddleware;