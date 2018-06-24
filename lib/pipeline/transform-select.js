/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-03 10:07:54
 */

var Transform = require('../pipeline/transform');
var Result = require('../entity/result');

class ExtractTransform extends Transform{
    constructor (config) {
        config.objectMode = true;
        super(config);
    }
    _transform(result, encoding, callback){
        let fields = this.config.fields || "all";
        if (fields !== "all") {
            let r = new Result();
            fields.forEach(field => {
                r.set(field, result.get(field));
            });
            result = r;
        }
        this.push(result);
        callback();
    }
}

module.exports = ExtractTransform;