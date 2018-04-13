/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 11:45:56
 */
var Log =require('../util/log');
var Base = require('../core/Base');

var log = new Log(5);

class Source extends Base{
    constructor (config) {
        super();
        this.config = config;
        
        if (!this.config){
            throw new Error('Undefined taskConfig of <' + taskId + '>');
        }
        this.output = null;
    }
    
    pipe (writer){
        this.output = writer;
    }
}

module.exports = Source;