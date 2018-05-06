/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 21:13:03
 */

var Transform = require('../pipeline/transform');
var util = require('util');
class JoinTransform extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true
        super(config);
        this.separator =  this.config.separator || "\t";
        this.on('header', headers => {
            if (headers && Array.isArray(headers.header)){
                this.push(headers.header.join(this.separator) + '\n');
            }
        });
    }
    _transform(array, encoding, callback){
        if (Array.isArray(array)){
            this.push(array.join(this.separator) + '\n');
        }
        callback();
    }
}

module.exports = JoinTransform;