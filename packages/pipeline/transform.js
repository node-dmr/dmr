/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-19 16:23:07
 */
var Log =require('../util/log');
var Stream = require('stream');

var log = new Log(5);

class Transform extends Stream.Transform{
    constructor (config) {
        super(config);
        this.config = config;;
    }
}

module.exports = Transform;