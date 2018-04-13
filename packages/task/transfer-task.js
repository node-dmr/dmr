/*
 * @Author: qiansc 
 * @Date: 2018-04-10 11:11:29 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 20:39:31
 */
var fs  = require('fs');
var path = require('path');
var Log =require('../util/log');
var env = require('../core/env');
var Task = require('../core/task');
var File = require('../util/file');
var SourceFactory = require('../core/source-factory');

var log = new Log(5);

class TransferTask extends Task{
    constructor(config){
        super(config);
    }
    run () {
        var importSource = SourceFactory.create(this.config["input-source"]);
        importSource.set('range', this.option.range);
        var reader = importSource.createReadStream(this.option.file);
    }
    
}

module.exports = TransferTask;