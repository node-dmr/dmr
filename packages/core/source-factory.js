/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 17:34:44
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var config = require('../core/config');
var HttpSource = require('../source/http-source.js');

var log = new Log(5);
class SourceFactory {
    static createById(sourceId){
        var sourceConfig = config.import && config.import.source && config.import.source[sourceId];
        if (!sourceConfig){
            log.warn('L1', 'sourceConfig ' , this.sourceConfig);
            throw new Error('Undefined sourceConfig of <' + sourceId + '>');
        }
        switch(sourceConfig.type){
            case "http":
                return new HttpSource(sourceConfig);
                break;
            default:
                break;
        }
    }
}

module.exports = SourceFactory;