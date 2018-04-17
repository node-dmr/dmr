/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 22:23:26
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');

var log = new Log(5);
class Factory {
    static create(key){
        var config = Config.get('middleware', key);
        switch(config.type){
            case "line":
                // return new HttpSource(config);
                break;
            case "file":
                // return new FileSource(config);
                break;
            default:
                break;
        }
    }
}

module.exports = Factory;