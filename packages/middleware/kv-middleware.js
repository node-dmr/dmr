/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 13:08:09
 */
var Middleware = require('../middleware/middleware');

class KvMiddleware extends Middleware{
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
        var cloume = this.config.cloume || {};
        if (this.partten) {
            var kv = string.match(this.partten);
            var key = kv[1];
            var value = kv[2];
            if (cloume[key]){
                if(cloume[key].necessary === "true" && !value){
                    return next(false);
                }
                return next([key, value]);
            } else {
                return next(false);
            }
            
        } else {
            return next(false);
        }
    }

}

module.exports = KvMiddleware;