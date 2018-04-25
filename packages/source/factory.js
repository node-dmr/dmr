/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 21:19:19
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var HttpSource = require('../source/source-http.js');
var FileSource = require('../source/source-file');
var FtpSource = require('../source/source-ftp');

var log = new Log(5);
class SourceFactory {
    static create(key){
        var config = Config.get('source', key);
        switch(config.module){
            case "source-http":
                return new HttpSource(config);
                break;
            case "source-file":
                return new FileSource(config);
                break;
            case "source-ftp":
                return new FtpSource(config);
                break;
            default:
                break;
        }
    }
}

module.exports = SourceFactory;