/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-19 16:43:11
 */

var Transform = require('../pipeline/transform');
var util = require('util');
class Connector extends Transform{
    constructor (config) {
        super(config);
    }
    _transform(chunk, encoding, callback){
        this.push(chunk);
        callback();
    };
}

module.exports = Connector;