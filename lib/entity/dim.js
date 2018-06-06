/*
 * @Author: qiansc 
 * @Date: 2018-06-03 11:27:19 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-03 13:57:59
 */
// const Result = require('./result');
class Dim {
    constructor (string) {
        this.field = {};
        if (string) {
            this.parse(string);
        }
    }
    set (key, value) {
        this.field[key] = value;
    }
    stringfy () {
        if (Object.keys(this.field).length === 0) {
            return "all";
        }
        let arr = [];
        Object.keys(this.field).forEach(f => {
            arr.push(
                encodeURIComponent(f) +
                (this.field[f]? ('=' + encodeURIComponent(this.field[f])) : "")
            );
        });
        return arr.join('|');
    }
    parse (string) {
        if (string === "all") {
            this.field = {};
        } else {
            let arr = string.split('|');
            arr.forEach(a => {
                a = a.split('=');
                this.set(a[0], a[1] || "");
            });
        }
    }
}

module.exports = Dim;