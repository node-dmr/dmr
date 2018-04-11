/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 16:13:22
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var HttpSource = require('../source/http-source.js');

var log = new Log(5);
class SourceFactory {
    static create(type, id ){
        var config = Config.get('source', type, id);
        var task;
        switch(config.type){
            case "http":
                return new HttpSource(config);
                break;
            default:
                break;
        }
    }
}

module.exports = SourceFactory;