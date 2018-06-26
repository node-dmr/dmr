/*
 * @Author: qiansc 
 * @Date: 2018-06-03 11:27:19 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-26 14:00:09
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
    /* condition = {
            'idc'   : 'all',
            'format': ['iphone'],
            'field' : '*'
        }
    */
    match (condition) {
        condition = condition || {};
        condition.field = condition.field || '**';
        condition.caculate = condition.caculate || '**';
        let matched = true;
        Object.keys(condition).forEach(key =>{
            if (typeof condition[key] === 'string' && condition[key] !== '*' && condition[key] !== '**') {
                condition[key] = [condition[key]];
            }
            if (Array.isArray(condition[key])) {
                let onematched = false;
                condition[key].forEach(val => {
                    if (val === "all" && this.field[key] === undefined) {
                        onematched = true;
                    } else if (this.field[key] === val) {
                        onematched = true;
                    }
                });
                if (onematched === flase) {
                    matched = false;
                }
            }
        });

        // 先扫描已有字段看有没有不在condition内的，排除掉
        Object.keys(this.field).forEach(key => {
            if (condition[key] === undefined) {
                matched = false;
            } else if (condition[key] === '*' || condition[key] === '**') {
                // donothing
            }
        });
        
        if (matched) {
            let result = {};
            Object.keys(condition).forEach(key =>{
                if (condition[key] !== '**') {
                    if (this.field[key] !== undefined) {
                        result[key] = this.field[key];
                    } else if (this.field[key] === undefined && condition[key] === "*"){
                        result[key] = "*";
                    }
                }
            });
            return result;
        }
        return false;
    }
}

module.exports = Dim;