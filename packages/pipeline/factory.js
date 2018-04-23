/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 18:59:00
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var LineTransform = require('../pipeline/line-transform')
var MiddlewareTransform = require('../pipeline/middleware-transform');

var log = new Log(5);
class Factory {
    static create(key, option){
        var config = Config.get('pipeline', key);
        config = Object.assign(config , option);
        switch(config.module){
            case "line-transform":
                return new LineTransform(config);
                break;
            case "middleware-transform":
                return new MiddlewareTransform(config);
                // return getCache(MiddlewareTransform, key, config);
                break;
            default:
                break;
        }
    }
}

var cache = {};
function getCache (Target, key, config){
    var rs = cache[key] || new Target(config);
    cache[key] = rs;
    return rs;
}
module.exports = Factory;