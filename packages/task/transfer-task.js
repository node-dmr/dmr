/*
 * @Author: qiansc 
 * @Date: 2018-04-10 11:11:29 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 12:00:54
 */
var fs  = require('fs');
var path = require('path');
var Log =require('../util/log');
var env = require('../core/env');
var Task = require('../core/task');
var file = require('../util/file');
var file = require('../util/file');

var log = new Log(5);

class TransferTask extends Task{
    constructor(config){
        super(config);
    }
    
}

module.exports = TransferTask;