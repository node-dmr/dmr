/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-07-16 14:04:13
 */

var util = require('util');
var Transform = require('../pipeline/transform');
var Result = require('../entity/result');

class ExtractTransform extends Transform{
    constructor (config) {
        config.objectMode = true;
        super(config);
        // @CN 生成预处理配置
        this._normalizeExps(config.expression);
    }
    _transform (result, encoding, callback) {
        this.exps.forEach(exp => {
            let rs;
            if (exp.type === "exp") {
                let arg = [];
                exp.arg.forEach(f => {
                    arg.push(typeof  f === "number" ? f : result.get(f));
                });
                rs = exp.fn.apply(this, arg);
            } else if (exp.type === "fx") {
                let arg = [];
                exp.arg.forEach(f => {
                    arg.push(typeof  f === "number" ? f : result.get(f));
                });
                rs =  exp.fn.call(this, exp.fx, arg);
            }
            result.set(exp.field, this._precise(rs, exp.precise));
        });
        this.push(result);
        callback();
    }
    _precise(num, p) {
        return Math.round(num * p) / p;
    }
    _normalizeExps(expression) {
        let arr = [];
        expression = expression || [];
        expression.forEach(item => {
            if (Array.isArray(item[0])){
                item[0].forEach(f => {
                    let l = item.concat();
                    l[0] = f;
                    arr.push(l);
                });
            } else {
                arr.push(item);
            }
        });
        arr.forEach((item, index) => {
            if (typeof item[1] === "string" && item[1].indexOf('{{') === 0) {
                item[1] = item[1].replace(/\$this/g, '$' + item[0]);
            } else if (Array.isArray(item[2])){
                let item2 = [];
                item[2].forEach(it => {
                    if (typeof it === "string") {
                        item2.push(it.replace(/\$this/g, item[0]));
                    } else {
                        item2.push(it);
                    }
                });
                item[2] = item2;
            }
        });
        this.exps = [];
        arr.forEach(item => {
            // 进行拷贝
            let e = item.concat();
            let exp, opt = {};
            if (e.length < 2 ) return;
            if (typeof e[e.length-1] === "object") {
                opt = e.pop();
            }
            opt = Object.assign({
                // 精度
                "precise": 3
            }, opt);
            let fn;
            if (e.length === 3 && Array.isArray(e[2])) {
                fn = this['_' + e[1]];
                exp = {
                    type: "exp",
                    field: e[0],
                    fn: fn,
                    arg: e[2],
                    precise: Math.pow(10, opt.precise || 2)
                };
            } else if(e.length === 2 && typeof e[1] ==="string" && e[1].indexOf('{{') == 0) {
                let expstring = '(' + e[1].substring(2, e[1].length - 2) + ')';
                let arr = [];
                let fx =  expstring.replace(/(\$\w+)/g, $f => {
                    arr.push($f.substring(1));
                    return "$RR$";
                });
                fx = fx.split("$RR$");
                exp = {
                    type: "fx",
                    field: e[0],
                    fn: this['_cal'],
                    arg: arr,
                    fx: fx,
                    precise: Math.pow(10, opt.precise || 2)
                };
            }
            if (exp) {
                this.exps.push(exp);
            }
        });
    }
    _rise (a, b) {
        return b - a;
    }
    _diff (a, b) {
        return a - b;
    }
    _sub (a, b) {
        return a + b;
    }
    _avg () {
        let sum = this._sum.apply(this, arguments);
        return sum / arguments.length;
    }
    _multiply (a, b) {
        return a * b;
    }
    _divide (a, b) {
        return a / b;
    }
    _sum () {
        let sum = 0;
        for (let i = 0;i < arguments.length; i++) {
            sum += Number(arguments[i]);
        }
        return sum;
    }
    _cal (fx, arg) {
        var exp = [];
        fx.forEach((item, index) => {
            if (index > 0) {
                exp.push(arg[index -1] || 0);
            }
            exp.push(item);
        });
        exp =  exp.join('');
        try {
            return eval(exp);
        } catch (e) {

        }
        return;
        
    }
}


module.exports = ExtractTransform;