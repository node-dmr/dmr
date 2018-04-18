/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-18 20:42:33
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var LineDuplexer = require('../pipeline/line-duplexer');
var ExtractDuplexer = require('../pipeline/extract-duplexer');

var log = new Log(5);
class Factory {
    static create(key){
        var config = Config.get('pipeline', key);
        switch(config.module){
            case "line-duplexer":
                return new LineDuplexer(config);
                break;
            case "extract-duplexer":
                return new ExtractDuplexer(config);
                break;
            default:
                break;
        }
    }
}

module.exports = Factory;