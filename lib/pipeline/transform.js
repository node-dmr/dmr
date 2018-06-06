/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-01 10:25:02
 */
var Log =require('../util/log');
var Stream = require('stream');

var log = new Log(5);

class Transform extends Stream.Transform{
    constructor (config) {
        config = config || {};
        // config.readableObjectMode = config.readableObjectMode === undefined ? true : config.readableObjectMode;
        // config.writableObjectMode = config.writableObjectMode === undefined ? true : config.writableObjectMode;
        // config.objectMode = config.objectMode === undefined ? true : config.objectMode;
        super(config);
        this.config = config;

        var self = this;
        function sendHeaders(headers){
            self.emit('header', headers);
        }
        this.on('pipe', src => {
            src.on('header', sendHeaders);
        });
        this.on('unpipe', src => {
            self.removeListener('header', sendHeaders);
        });
        
    }
}

module.exports = Transform;