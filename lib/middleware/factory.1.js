/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 21:20:51
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config');
var ColumnMiddleware = require('../middleware/middleware-column');
var ChainMiddleware = require('../middleware/middleware-chain');
var SeparateMiddleware = require('../middleware/middleware-separate');
var MultipleMiddleware = require('../middleware/middleware-multiple');
var MergeMiddleware = require('../middleware/middleware-merge');
var MapToRowMiddleware =  require('../middleware/middleware-map-to-row');
var SingleMiddleWare = require('../middleware/middleware-single');
var RegexpMiddleWare = require('../middleware/middleware-regexp');
var PerformanceMiddleWare = require('../middleware/middleware-performance');

var log = new Log(5);
class Factory {
    static create(key, option){
        var config = Config.get('middleware', key);
        config = Object.assign(config || {}, option);
        switch(config.module){
            case "middleware-chain":
                return new ChainMiddleware(config);
                break;
            case "middleware-separate":
                return new SeparateMiddleware(config);
                break;
            case "middleware-multiple":
                return new MultipleMiddleware(config);
                break;
            case "middleware-column":
                //return getCache(KvMiddleware, key, config);
                return new ColumnMiddleware(config);
                break;
            case "middleware--map-to-row":
                return new MapToRowMiddleware(config);
                break;
            case "middleware-merge":
                return new MergeMiddleware(config);
                break;
            case "middleware-single":
                return new SingleMiddleWare(config);
                break;
            case "middleware-regexp":
                return new RegexpMiddleWare(config);
                break;
            case "middleware-performance":
                return new PerformanceMiddleWare(config);
                break;
            default:
                break;
        }
    }
}
// 测试现阶段cache instance并没有更快，代码先保存
// var cache = {};
// function getCache (Target, key, config){
//     var rs = cache[key] || new Target(config);
//     cache[key] = rs;
//     return rs;
// }

module.exports = Factory;