/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-15 10:47:15
 */
let EventEmitter = require('events');
let Log = require('../util/log');
let Config = require('../core/config');
let Noop = require('./noop');
let dividerRegexp = require('./divider/regexp');
let dividerSeparate = require('./divider/separate');
let dividerDeformat = require('./divider/deformat');
let dividerShunt = require('./divider/shunt');
// let dividerDebug = require('./divider/debug');
let assignPair = require('./pair/assign');
let stringPair = require('./pair/string');
let seriesPair = require('./pair/series');
let jsonPair = require('./pair/json');

let log = new Log(5);
class Factory {
    static create(config){
        // console.log(config.module);
        if (typeof config === "string") {
            return new stringPair(config);
        }
        switch(config.module){
            case "divider-separate":
                return new dividerSeparate(config);
                break;
            case "divider-regexp":
                return new dividerRegexp(config);
                break;
            case "divider-deformat":
                return new dividerDeformat(config);
                break;
            case "divider-shunt":
                return new dividerShunt(config);
                break;
            // case "divider-debug":
            //     return new dividerDebug(config);
            //     break;
            case "pair-assign":
                return new assignPair(config);
                break;
            case "pair-series":
                return new seriesPair(config);
                break;
            case "pair-json":
                return new jsonPair(config);
                break;
            default:
                return new Noop(config);
                break;
        }
    }
}
// 测试现阶段cache instance并没有更快，代码先保存
// let cache = {};
// function getCache (Target, key, config){
//     let rs = cache[key] || new Target(config);
//     cache[key] = rs;
//     return rs;
// }

module.exports = Factory;