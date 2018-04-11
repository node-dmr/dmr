/*
 * @Author: qiansc 
 * @Date: 2018-04-10 11:11:29 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 19:36:07
 */
var fs  = require('fs');
var path = require('path');
var Log =require('../util/log');
var env = require('../core/env');
var Task = require('../core/task');
var file = require('../util/file');
var Time = require('../util/time');
var dtpl= require('../util/data-template');
var file = require('../util/file');

var log = new Log(5);

class TransferTask extends Task{
    constructor(config){
        super(config);
    }
    
}

module.exports = TransferTask;