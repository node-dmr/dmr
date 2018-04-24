/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-24 16:32:07
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var LineTransform = require('../pipeline/line-transform')
var MiddlewareTransform = require('../pipeline/middleware-transform');
var JoinTransform = require('../pipeline/join-transform');
var zlib = require("zlib");

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
                break;
            case "join-transform":
                return new JoinTransform(config);
                break;
            case "zlib":
                if (config.method == "gunzip") {
                    return zlib.createGunzip();
                } else {
                    throw new Error('Undefined method!');
                }
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