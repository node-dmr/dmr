/*
 * @Author: qiansc 
 * @Date: 2018-04-03 10:57:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-03 11:05:55
 */
var events = require('events');

module.exports = Task;

function Task() {
    this.id = getId();
    this.eventEmitter = new events.EventEmitter();
}


function getId(){
    return 'T' + (new Date().getTime() * 1000 + Math.round(Math.random()*999));
}
