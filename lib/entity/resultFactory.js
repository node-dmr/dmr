/*
 * @Author: qiansc 
 * @Date: 2018-05-19 11:11:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-10 18:23:35
 */
const dp = require('../util/data-template');
const Result = require('./result');

class ResultFactory{
    constructor (config) {
        this.setConfig(config);
    }
    setConfig (config) {
        this.config = config;
        this.deal = [];
        // 因为result可能有模板变量处理较慢需要预处理，如果直接是$和string形式希望提速
        // 把后续要处理的action存放到deal中
        config.forEach(pair => {
            let pair2;
            if (pair[2] && Array.isArray(pair[2])){
                pair2 = [];
                pair[2].forEach(p => {
                    pair2.push(processAttr(p));
                });
            }
            this.deal.push([
                processAttr(pair[0]),
                processAttr(pair[1]),
                pair2
            ]);
        });
    }
    parse (data) {
        // 根据传入的data处理key/value
        let result = new Result();
        this.deal.forEach(p => {
            let key = parseAttr(p[0], data);
            let value = parseAttr(p[1], data);
            result.set(key, value);
        });
        return result;
    }
};

function processAttr (key){
    let matches = key.match(/^\$(\w+)$/);
    if (matches && matches[1]){
        key = {target: matches[1]}
    } else if (key.indexOf('{$') > -1) {
        key = {regTemplate: key};
    } else if (key.indexOf('{' == 0)){
        key = {regTemplate: key};
    }
    return key;
}

function parseAttr (attr, matches) {
    if (typeof attr === "string") {
        return attr;
    }
    if (attr.target) {
        return matches[attr.target];
    }
    if (attr.regTemplate) {
        return dp(attr.regTemplate, matches);
    }
}
module.exports = ResultFactory;