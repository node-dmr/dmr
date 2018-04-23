/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 13:27:34
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config');
var SliceMiddleware = require('../middleware/slice-middleware');
var KvMiddleware = require('../middleware/kv-middleware');
var ChainMiddleware = require('../middleware/chain-middleware');
var SeparateMiddleware = require('../middleware/separate-middleware');

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
            case "slice-middleware":
                return new SliceMiddleware(config);
                break;
            case "kv-middleware":
                //return getCache(KvMiddleware, key, config);
                return new KvMiddleware(config);
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