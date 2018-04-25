/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 20:19:05
 */
var Log = require('../util/log');
var Stream = require('stream');

var log = new Log(5);

class Shunt extends Stream.Writable{
    constructor () {
        super();
        this.streams = [];        
        // if (!this.config){
        //     throw new Error('Undefined pipelineConfig!');
        // }
        // this.output = null;
    }
    _write (buf, encoding, callback) {
        this.streams.forEach(function (stream) {
            stream.write(buf);
        });
        callback();
    }
    pipeTo (stream) {
        this.streams.push(stream);
    }
    
    unpipeFrom (stream) {
        this.streams = _.without(this.streams, stream);
    }
}

module.exports = Shunt;