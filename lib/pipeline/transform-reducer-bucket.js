/*
 * @Author: qiansc 
 * @Date: 2018-04-26 09:31:45 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-19 20:37:45
 */
const Transform = require('../pipeline/transform');
const util = require('util');
const Reducer = require('../calculate/reducer');
const Bucket = require('../calculate/bucket');
const Result = require('../entity/result');

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
        let key = result.get('key');
        if (!this.reducers[key]) {
            this.reducers[key] = new Bucket();
        }
        this.reducers[key].add(result.get('value'));
        callback();
    }
    _flush (callback) {
        let caculateConf = this.config.caculate;
        Object.keys(this.reducers).forEach(key => {
            let reducer = this.reducers[key];
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