/*
 * @Author: qiansc 
 * @Date: 2018-04-13 11:34:57 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 12:21:13
 */

class Formatter {
    constructor(option){
        this.option = {};
        this.set(option || {});
    }
    set (option, value) {
        if (value){
            this.option[option] = value;
        }else {
            this.option = Object.assign(this.option , option);
        }
    }
}

module.exports = Formatter;