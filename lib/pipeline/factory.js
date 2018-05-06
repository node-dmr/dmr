/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-02 19:59:22
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var env = require('../core/env');
var Config = require('../core/config.js');
var LineTransform = require('../pipeline/transform-line')
var MiddlewareTransform = require('../pipeline/transform-middleware');
var TableTransform = require('../pipeline/transform-table');
var JoinTransform = require('../pipeline/transform-join');
var DimMapperTransform = require('../pipeline/transform-dim-mapper');
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
            case "transform-middleware":
                return new MiddlewareTransform(config);
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
            case "transform-dim-mapper":
                return new DimMapperTransform(config);
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