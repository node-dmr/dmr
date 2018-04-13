/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 14:18:18
 */
var http = require('http')
var qs=require('querystring');
var path=require('path');
var fs=require('fs');
var env = require('../core/env');
var Log =require('../util/log');
var Source = require('../core/source');
var File = require('../util/file');
var log = new Log(5);

class HadoopSource extends Source{
    constructor(config){
        super(config);
        this.formatter;
    }
}

module.exports = HadoopSource;