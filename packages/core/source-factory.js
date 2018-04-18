/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-18 20:43:04
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var HttpSource = require('../source/http-source.js');
var FileSource = require('../source/file-source');

var log = new Log(5);
class SourceFactory {
    static create(key){
        var config = Config.get('source', key);
        switch(config.module){
            case "http-source":
                return new HttpSource(config);
                break;
            case "file-source":
                return new FileSource(config);
                break;
            default:
                break;
        }
    }
}

module.exports = SourceFactory;