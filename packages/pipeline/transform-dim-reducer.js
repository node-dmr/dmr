/*
 * @Author: qiansc 
 * @Date: 2018-04-26 09:31:45 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-26 10:20:06
 */
var Transform = require('../pipeline/transform');
var util = require('util');
var Reducer = require('../calculate/reducer');

class ExportTransform extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
        config["key-field"] = config["key-field"] || ["dim","field"];
        config.caculate = config.caculate || {
            "pos": [80],
            "average": true,
            "count": true
        }
        super(config);
        this.reducers = {

        };
    }
    _transform(data, encoding, callback){
        var key = [];
        this.config["key-field"].forEach(field => {
            key.push(data[field]);
        });
        key = key.join('\t');
        if (!this.reducers[key]) {
            this.reducers[key] = new Reducer();
        }
        this.reducers[key].add(data.value);
        callback();
    }
    _flush () {
        var headers = this.config["key-field"];
        headers.push('caculate').push('value');
        var results = [];
        var caculateConf = this.config.caculate;
        Object.keys(this.reducers).forEach(key => {
            var reducer = this.reducers[key];
            reducer.reduce();
            if (caculateConf.count) {
                var result = key.split('\t');
                result.push('count').push(reducer.count());
                results.push();
            }
        });
    }
}

module.exports = ExportTransform;