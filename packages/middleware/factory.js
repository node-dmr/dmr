/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 19:15:24
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config');
var CloumeMiddleware = require('../middleware/cloume-middleware');
var ChainMiddleware = require('../middleware/chain-middleware');
var SeparateMiddleware = require('../middleware/separate-middleware');
var MultipleMiddleware = require('../middleware/multiple-middleware');
var JoinMiddleware = require('../middleware/join-middleware');
var MapMiddleware =  require('../middleware/map-middleware');

var log = new Log(5);
class Factory {
    static create(key, option){
        var config = Config.get('middleware', key);
        config = Object.assign(config , option);
        switch(config.module){
            case "chain-middleware":
                return new ChainMiddleware(config);
                break;
            case "separate-middleware":
                return new SeparateMiddleware(config);
                break;
            case "multiple-middleware":
                return new MultipleMiddleware(config);
                break;
            case "cloume-middleware":
                //return getCache(KvMiddleware, key, config);
                return new CloumeMiddleware(config);
                break;
            case "map-middleware":
                return new MapMiddleware(config);
                break;
            case "join-middleware":
                return new JoinMiddleware(config);
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