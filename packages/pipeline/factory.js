/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 15:22:34
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var LineTransform = require('../pipeline/line-transform')
var MiddlewareTransform = require('../pipeline/middleware-transform');
var TableTransform = require('../pipeline/table-transform');
var JoinTransform = require('../pipeline/join-transform');
var zlib = require("zlib");

var log = new Log(5);
class Factory {
    static create(key, option){
        var config = Config.get('pipeline', key);
        config = Object.assign(config , option);
        if (!config) {
            throw new Error('Can not find config of pipeline: '+ key);
        }
        switch(config.module){
            case "line-transform":
                return new LineTransform(config);
                break;
            case "middleware-transform":
                return new MiddlewareTransform(config);
                break;
            case "table-transform":
                return new TableTransform(config);
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
                throw new Error('Can not create pipeline: ' + key + " / " + config.module);
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