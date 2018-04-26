/*
 * @Author: qiansc 
 * @Date: 2018-04-26 09:52:42 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-26 20:54:39
 */
class Reducer {
    constructor (option) {
        this.list = [];
    }
    add (value) {
        this.list.push(value);
    }
    reduce () {
        
    }
    avg () {
        return this.list[0];
    }
    pos () {
        
    }
    count () {
        return this.list.length;
    }
}

module.exports = Reducer;