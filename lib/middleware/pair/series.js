/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-15 12:15:08
 */
const Pair = require('./pair');
const ResultFactory = require('../../entity/resultFactory');

class Series extends Pair {
    constructor (config) {
        super(config);
        this.allowRepeat = config["allow-repeat"] === "true";
        var partten = config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
        }
        if (config.pair) {
            this.rf = new ResultFactory([config.pair]);
        }
    }
    deal (part) {
        let result;
        if (this.partten) {
            //let matches = part.match(this.partten);
            let matches;
            while(matches = this.partten.exec(part))
            {
                let pair = this.rf.parse(matches);
                if (result) {
                    if (this.allowRepeat) {
                        result.push(pair[0]);
                    } else {
                        result.set(pair[0][0], pair[0][1]);
                    }
                } else {
                    result = pair;
                }
            }
        }
        return result;
    }
}

module.exports = Series;