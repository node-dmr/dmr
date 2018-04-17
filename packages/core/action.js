/*
 * @Author: qiansc 
 * @Date: 2018-04-17 10:05:18 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 19:56:53
 */
var Parameters = require('../core/parameters');

class Action extends Parameters{
    constructor (param) {
        super(param);
    }
    stringify (){
        return JSON.stringify(this.param());
    }
    static parse (string){
        return new Action(JSON.parse(string));
    }
}

module.exports = Action;

// process => cmd => task (config,option).action => source