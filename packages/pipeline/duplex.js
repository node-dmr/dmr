/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-19 16:07:05
 */
var Log =require('../util/log');
var Stream = require('stream');

var log = new Log(5);

class Duplex extends Stream.Duplex{
    constructor (config) {
        super(config);
        this.config = config;
        
        if (!this.config){
            throw new Error('Undefined pipelineConfig!');
        }
        // this.output = null;
    }
}

module.exports = Duplex;