/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 15:26:38
 */
var events = require('events');

module.exports = Task;

function Task(taskId) {
    console.log('superTask', taskId);
    //this.id = getId();
    //this.eventEmitter = new events.EventEmitter();
}


Task.prototype.test = function(){
    coonsole.log("TEST!");
    // this.eventEmitter.emit('start');
}

function getId(){
    // return 'T' + (new Date().getTime() * 1000 + Math.round(Math.random()*999));
}