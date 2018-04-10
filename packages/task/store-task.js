/*
 * @Author: qiansc 
 * @Date: 2018-04-10 11:11:29 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 15:55:43
 */
var Log =require('../util/log');
var config = require('../core/config');
var Task = require('../core/task');
var dtpl= require('../util/data-template');
var file = require('../util/file');
var Time = require('../util/time');
var util = require('util');
var Client = require('ftp');
var http = require('http');
var fs  = require('fs');
var qs=require('querystring');
var path = require('path');

var log = new Log(5);

module.exports =  StoreTask;
// object.create()
//  function StoreTask(taskId, param) {
//     console.log('StoreTask', taskId);
//     console.log('this is', this);
//  }

 util.inherits(StoreTask, Task);
 
 StoreTask.prototype.start = function () {
     
 }

 StoreTask.prototype.setOrigin = function () {

 }

 StoreTask.prototype.setOriginFile = function () {
    
 }
