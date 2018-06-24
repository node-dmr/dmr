/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 12:39:02
 */
var http = require('http')
var qs=require('querystring');
var path=require('path');
var fs=require('fs');
var Log =require('../util/log');
var Source = require('../source/source');
var File = require('../util/file');
var log = new Log(5);

class SourceHadoop extends Source{
    constructor(config){
        super(config);
        this.formatter;
    }
}

module.exports = HadoopSource;