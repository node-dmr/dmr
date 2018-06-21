/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-19 18:06:41
 */
const Log = require('../util/log');
const LineTransform = require('../pipeline/transform-line');
const LineBreakTransform = require('../pipeline/transform-line-break')
const SegmentTransform = require('../pipeline/transform-segment');
const TableTransform = require('../pipeline/transform-table');
const OperateTransform = require('../pipeline/transform-operate');
const MapperTransform = require('../pipeline/transform-mapper');
const BucketTransform = require('../pipeline/transform-reducer-bucket');

let zlib = require("zlib");

let log = new Log(5);
class Factory {
    static create(config){
        // let config = Config.get('pipeline', key);
        // config = Object.assign(config , option);
        if (!config) {
            throw new Error('Can not find config of pipeline!');
        }
        switch(config.module){
            case "transform-line":
                return new LineTransform(config);
                break;
            case "transform-line-break":
                return new LineBreakTransform(config);
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
            case "transform-reducer-bucket":
                return new BucketTransform(config);
                break;
            case "zlib":
                if (config.action == "gunzip") {
                    return zlib.createGunzip();
                } else {
                    throw new Error('Undefined method!');
                }
                break;
            default:
                    let Transform = require('../pipeline/' + config.module);
                    if (Transform) {
                        return new Transform(config);
                    } else {
                        throw new Error('Can not create pipeline: ' + key + " / " + config.module);
                    }
                break;
        }
    }
}

let cache = {};
function getCache (Target, key, config){
    let rs = cache[key] || new Target(config);
    cache[key] = rs;
    return rs;
}
module.exports = Factory;