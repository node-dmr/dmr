/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 22:47:20
 */

var Pipeline = require('../core/pipeline');
var util = require('util');
class Duplexer extends Pipeline{
    constructor (config) {
        super(config);
        //this.data = [];
    }
    _read (size) {
        
    };
    _write (data, encoding, callback) {
        //this.data.push(data);
        this.push(data);
        callback();
    };
}

module.exports = Duplexer;