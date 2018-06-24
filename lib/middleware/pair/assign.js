/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-10 18:05:45
 */
const Pair = require('./pair');
const ResultFactory = require('../../entity/resultFactory');

class Assign extends Pair {
    constructor (config) {
        super(config);
        var partten = config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
        }
        if (config.result) {
            this.rf = new ResultFactory(this.config.result);
        }
    }
    deal (part) {
        let result;
        if (this.partten && this.rf) {
            let matches = part.match(this.partten);
            if (matches) {
                result = this.rf.parse(matches);
            }
        }
        return result;
    }
}

module.exports = Assign;