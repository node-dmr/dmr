/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-24 21:13:44
 */
var Middleware = require('../middleware/middleware');

class MergeMiddleware extends Middleware{
    constructor (config) {
        config = config || {
            overwriteMode: false
        };
        super(config);
    }
    handle (arr, next) {
        var result = {};
        if(arr){
            arr.forEach(element => {
                Object.keys(element).forEach(key => {
                    if (this.config.overwriteMode) {
                        result[key] = element[key];
                    } else if(result[key] === undefined){
                        result[key] = element[key];
                    }
                });
            });
        } else {
            return next(false);
        }
        return next(result);
    }
}

module.exports = MergeMiddleware;