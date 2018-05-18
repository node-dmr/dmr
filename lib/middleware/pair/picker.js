/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-18 11:37:11
 */
const Pair = require('./pair');

class Picker extends Pair {
    constructor (config) {
        super(config);
        var partten = this.config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
        }
    }
    pick (part) {
        console.log(111, part);
        if (this.partten) {
            let arr = [];
            if (this.partten) {
                arr = part.match(partten) || false;
            }
            console.log(arr);
            // else if(this.config.separate){
            //     arr = string.split(this.config.separate);
            //     // & split 切割等待实现
            // }

            // var result = false;
            // if (arr && arr[this.config.index] !== undefined && this.config.column) {
            //     result = {};
            //     result[this.config.column] = arr[this.config.index];
            // }
        }
    }
}


function parttenSlice (partten, string) {
    var match = string.match(partten);
    return match || false;
}

module.exports = Picker;