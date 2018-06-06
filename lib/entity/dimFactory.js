/*
 * @Author: qiansc 
 * @Date: 2018-06-03 11:21:13 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-03 14:19:26
 */
const dp = require('../util/data-template');
const Dim = require('./dim');

class DimFactory{
    constructor (config) {
        this.setConfig(config);
    }
    setConfig (config) {
        this.config = config;
        this.dealFn = [];

        config.forEach(dim => {
            if (dim === "all") {
                this.dealFn.push(() => {return new Dim();});
                return;
            } else if (typeof dim === "string") {
                dim = [dim];
            }

            if (Array.isArray(dim)) {
                let option = [];
                dim.forEach(d => {
                    if (d.indexOf('{') === 0) {
                        let expstring = d;
                        let arr = [];
                        let fx =  expstring.replace(/(\$\w+)/g, $f => {
                            arr.push($f.substring(1));
                            return "$RR$";
                        });
                        fx = fx.split("$RR$");
                        option.push([d, arr, fx]);
                    } else {
                        option.push(d);
                    }
                });
                this.dealFn.push(result => {
                    let rsDim  = new Dim();
                    option.forEach(opt => {
                        if (Array.isArray(opt)) {
                            let exp = [];
                            opt[2].forEach((item, index) => {
                                if (index > 0) {
                                    exp.push(result.get(opt[1][index -1]) || 0);
                                }
                                exp.push(item);
                            });
                            exp =  exp.join('');
                            exp = exp.substring(1, exp.length - 1);
                            rsDim.set(exp, "");
                        } else {
                            rsDim.set(opt, result.get(opt));
                        }
                    });
                    return rsDim;
                });
            }
        });
    }
    deal (result) {
        let dims = [];
        this.dealFn.forEach(fn => {
            dims.push(fn.call(this, result));
        });
        return dims;
    }
};
module.exports = DimFactory;