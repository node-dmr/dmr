/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-20 16:13:47
 */

var Transform = require('../pipeline/transform');
var util = require('util');
class LineTransform extends Transform{
    constructor (config) {
        super(config);
        this.prevBuffer = new Buffer(0);
    }
    _transform(buffer, encoding, callback){
        var from = 0,
            to = 0;
        while((to = buffer.indexOf('\n', from)) > 0) {
            var lineBuffer = buffer.slice(from, to);
            if (this.prevBuffer.length) {
                // 前次chunk，存在剩余buffer进行拼接
                var lineBuffer = Buffer.concat([this.prevBuffer, lineBuffer],to - from + this.prevBuffer.length);
                this.prevBuffer = new Buffer(0);
            }
            this.push(lineBuffer);
            from = to + 1;
        }
        if (from < buffer.length) {
            // 剩余buffer留用
            this.prevBuffer = Buffer.concat([this.prevBuffer, buffer.slice(from, buffer.length)],
                buffer.length - from + this.prevBuffer.length);
        }
        callback();
    };
    _flush(callback){
        if (this.prevBuffer) {
            this.push(this.prevBuffer);
            this.prevBuffer = new Buffer(0);
        }
        callback();
    }
}

module.exports = LineTransform;