/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 18:39:19
 */

var Transform = require('../pipeline/transform');
class LineTransform extends Transform{
    constructor (config) {
        super(config);
        this.breaker = this.config && this.config["line-break"] || '\n';
    }
    _transform(buffer, encoding, callback){
        if(buffer.length) {
            this.push(buffer.toString() + this.breaker);
        }
        callback();
    };
}

module.exports = LineTransform;