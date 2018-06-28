/*
 * @Author: qiansc 
 * @Date: 2018-06-28 10:00:45 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-28 10:45:44
 */
const Transform = require('../pipeline/transform');
const Dim = require('../entity/dim');

class ExportTransform extends Transform{
    constructor (config) {
        config.objectMode = true;
        super(config);
    }
    _transform(result, encoding, callback){
        let dim = new Dim(result.get('key'));
        if (this.config.dimParten && dim.match(this.config.dimParten)) {
            this.push(result);
        }
        callback();
    }
}

module.exports = ExportTransform;