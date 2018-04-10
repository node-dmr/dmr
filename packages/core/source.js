/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 19:51:56
 */
var EventEmitter = require('events');
var Log = require('../util/log');
var config = require('../core/config');
var HttpSource = require('../source/http-source.js');

var log = new Log(5);

class Source extends EventEmitter{
    constructor (sourceConfig) {
        super();
        this.sourceConfig = sourceConfig || {};
        this.param = {
            starttimestamp: null,
            endtimestamp: null
        };
        this.output = null;
    }
    setParam (key, value) {
        this.param[key] = value;
    }
    setParams (json) {
        for (var key in json) {
            this.param[key] = json[key];
        }
    }
    pipe (writer){
        this.output = writer;
    }
}

module.exports = Source;