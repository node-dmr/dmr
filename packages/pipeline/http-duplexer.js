/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 22:36:18
 */

var Stream = require('stream');
var util = require('util');
class Duplexer extends Stream.Duplex{
    constructor (option) {
        super();
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