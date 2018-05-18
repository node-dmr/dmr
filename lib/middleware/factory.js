/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-18 11:33:31
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config');
var dividerSeparate = require('./divider/separate');
var pickerPair = require('./pair/picker');
var performancePair = require('./pair/performance');

var log = new Log(5);
class Factory {
    static create(config){
        // console.log(config.module);
        switch(config.module){
            case "divider-separate":
                return new dividerSeparate(config);
                break;
            case "pair-picker":
                return new pickerPair(config);
                break;
            case "pair-performance":
                return new performancePair(config);
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