/*
 * @Author: qiansc 
 * @Date: 2018-04-26 09:31:45 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-07 16:53:08
 */
var Transform = require('../pipeline/transform');
var util = require('util');
var Reducer = require('../calculate/reducer');
var Result = require('../entity/result');

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
    _transform(result, encoding, callback){
        var key = result.get('key');
        if (!this.reducers[key]) {
            this.reducers[key] = new Reducer();
        }
        this.reducers[key].add(result.get('value'));
        callback();
    }
    _flush (callback) {
        var caculateConf = this.config.caculate;
        Object.keys(this.reducers).forEach(key => {
            var reducer = this.reducers[key];
            reducer.reduce();
            if (caculateConf.count) {
                let report = new Result();
                report.set('key', key);
                report.set('calculate', "count");
                report.set('value', reducer.count());
                this.push(report);
            }
            if (caculateConf.average) {
                let report = new Result();
                report.set('key', key);
                report.set('calculate', "avg");
                report.set('value', reducer.avg());
                this.push(report);
            }
            if (caculateConf.pos) {
                caculateConf.pos.forEach(item => {
                    let report = new Result();
                    report.set('key', key);
                    report.set('calculate', "pos" + item);
                    report.set('value', reducer.pos(item));
                    this.push(report);
                });
            }
        });
        callback();
    }
}

module.exports = ExportTransform;