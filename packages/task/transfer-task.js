/*
 * @Author: qiansc 
 * @Date: 2018-04-10 11:11:29 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 21:30:37
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
    constructor(action){
        super(action);
    }
    run () {
        var self = this,
        action =  this.action,
        config = this.action.config;
        // 默认输出writer为控制台
        var writer = process.stdout;

        var importSource = SourceFactory.create(config["input-source"]);
        importSource.set('range', action.range);
        importSource.on('create', function (file) {
            log.warn('L1', 'FROM\t' , file);
        });
        var reader = importSource.createReadStream();

    }
    
}

module.exports = TransferTask;