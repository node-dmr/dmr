/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 12:38:40
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var HttpSource = require('../source/source-http.js');
var FileSource = require('../source/source-file');
var FtpSource = require('../source/source-ftp');

var log = new Log(5);
class SourceFactory {
    static create(config){
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