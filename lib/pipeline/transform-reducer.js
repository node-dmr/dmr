/*
 * @Author: qiansc 
 * @Date: 2018-04-26 09:31:45 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-04 16:32:27
 */
var Transform = require('../pipeline/transform');
var util = require('util');
var Reducer = require('../calculate/reducer');

class ExportTransform extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
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
        var key = data[0];
        if (!this.reducers[key]) {
            this.reducers[key] = new Reducer();
        }
        this.reducers[key].add(data[1]);
        callback();
    }
    _flush () {
        var caculateConf = this.config.caculate;
        Object.keys(this.reducers).forEach(key => {
            var reducer = this.reducers[key];
            reducer.reduce();
            if (caculateConf.count) {
                this.push({
                    "key": key,
                    "calculate":"count",
                    "value": reducer.count()
                });
            }
            if (caculateConf.average) {
                this.push({
                    "key": key,
                    "calculate":"avg",
                    "value": reducer.avg()
                });
            }
            if (caculateConf.pos) {
                caculateConf.pos.forEach(item => {
                    this.push({
                        "key": key,
                        "calculate":"pos" + item,
                        "value": reducer.pos(item)
                    });
                });
            }
        });
    }
}

module.exports = ExportTransform;