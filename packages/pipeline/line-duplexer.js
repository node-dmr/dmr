/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-18 19:09:38
 */

var Pipeline = require('../core/pipeline');
var util = require('util');
class Duplexer extends Pipeline{
    constructor (config) {
        super(config);
        this.prevBuffer = new Buffer(0);
    }
    _read (size) {
        
    };
    _write (data, encoding, callback) {
        var buffer = new Buffer(data);
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
    end(){
        if (this.prevBuffer) {
            this.push(this.prevBuffer);
            this.prevBuffer = new Buffer(0);
        }
        super.end.apply(this,arguments);
    }
}

module.exports = Duplexer;

// Buffer.concat(list, len).toString();
/**
 *  options <Object> 传给可读和可写流的构造函数，还有如下字段：
    allowHalfOpen <boolean> 默认是true。如果设置为false, 那么当读端停止时，写端自动停止。
    readableObjectMode <boolean> 默认是 false。会为流的读端设置objectMode。如果 objectMode是 true，那就没有任何用。
    writableObjectMode <boolean> 默认是 false。会为流的写端设置objectMode。如果 objectMode是 true，那就没有任何用。
    readableHighWaterMark <number> 设置 highWaterMark 可读流的缓冲区大小。 如果已经设置 highWaterMark则readableHighWaterMark不起作用。
    writableHighWaterMark <number> 设置 highWaterMark 可写流缓冲区大小。如果设置了highWaterMark 则writableHighWaterMark不起作用。
 */