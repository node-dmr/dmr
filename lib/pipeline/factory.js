/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-03 19:29:05
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var LineTransform = require('../pipeline/transform-line')
var SegmentTransform = require('../pipeline/transform-segment');
var TableTransform = require('../pipeline/transform-table');
var OperateTransform = require('../pipeline/transform-operate');
var MapperTransform = require('../pipeline/transform-mapper');

var zlib = require("zlib");

var log = new Log(5);
class Factory {
    static create(config){
        // var config = Config.get('pipeline', key);
        // config = Object.assign(config , option);
        if (!config) {
            throw new Error('Can not find config of pipeline!');
        }
        switch(config.module){
            case "transform-line":
                return new LineTransform(config);
                break;
            case "transform-segment":
                return new SegmentTransform(config);
                break;
            case "transform-table":
                if (config.action == "format") {
                    return new TableTransform.Formater(config);
                } else if(config.action == "parser"){
                    return new TableTransform.Parser(config);
                }
                break;
            case "transform-join":
                return new JoinTransform(config);
                break;
            case "transform-operate":
                return new OperateTransform(config);
                break;
            case "transform-mapper":
                return new MapperTransform(config);
                break;
            case "zlib":
                if (config.action == "gunzip") {
                    return zlib.createGunzip();
                } else {
                    throw new Error('Undefined method!');
                }
                break;
            default:
                    var Transform = require('../pipeline/' + config.module);
                    if (Transform) {
                        return new Transform(config);
                    } else {
                        throw new Error('Can not create pipeline: ' + key + " / " + config.module);
                    }
                break;
        }
    }
}

var cache = {};
function getCache (Target, key, config){
    var rs = cache[key] || new Target(config);
    cache[key] = rs;
    return rs;
}
module.exports = Factory;