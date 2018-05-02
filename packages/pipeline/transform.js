/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-02 09:54:09
 */
var Log =require('../util/log');
var Stream = require('stream');
var ActionImplements = require('../core/action-implements');

var log = new Log(5);

class Transform extends Stream.Transform{
    constructor (config) {
        super(config);
        this.config = config;
        ActionImplements.applyOn(this);

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