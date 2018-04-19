/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-19 16:37:01
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var LineTransform = require('../pipeline/line-transform')
var ExtractTransform = require('../pipeline/extract-transform');

var log = new Log(5);
class Factory {
    static create(key, option){
        var config = Config.get('pipeline', key);
        config = Object.assign(config , option);
        switch(config.module){
            case "line-transform":
                return new LineTransform(config);
                break;
            case "extract-transform":
                return new ExtractTransform(config);
                break;
            default:
                break;
        }
    }
}

module.exports = Factory;