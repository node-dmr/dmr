/*
 * @Author: qiansc 
 * @Date: 2018-06-03 11:27:19 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-29 01:27:45
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
    del (key) {
        delete this.field[key];
    }
    get (key) {
        return this.field[key];
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
    /* parten = {
            'idc'   : 'all',
            'format': ['iphone'],
            'field' : '*'
        }
    */
    match (parten) {
        parten = parten || {};
        parten.field = parten.field || '**';
        parten.calculate = parten.calculate || '**';
        let matched = true;
        Object.keys(parten).forEach(key =>{
            if (typeof parten[key] === 'string' && parten[key] !== '*' && parten[key] !== '**') {
                // normalize
                // *            any
                // undefined    all
                // xxx          xxx
                parten[key] = [parten[key]];
            }
            if (Array.isArray(parten[key])) {
                let onematched = false;
                parten[key].forEach(val => {
                    if (val === "all" && (this.field[key] === undefined || this.field[key] === "_all")) {
                        onematched = true;
                    } else if (this.field[key] === val) {
                        onematched = true;
                    }
                });
                if (onematched === false) {
                    matched = false;
                }
            }
        });

        // 先扫描已有字段看有没有不在parten内的，排除掉
        Object.keys(this.field).forEach(key => {
            if (parten[key] === undefined) {
                matched = false;
            }
        });
        
        if (matched) {
            let dims = {};
            Object.keys(parten).forEach(key =>{
                if (parten[key] !== '**') {
                    if (this.field[key] !== undefined) {
                        dims[key] = this.field[key];
                    } else if (this.field[key] === undefined){
                        dims[key] = "_all";
                    }
                }
            });
            return dims;
        }
        return false;
    }
}

module.exports = Dim;