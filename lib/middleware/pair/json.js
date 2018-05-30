/*
 * @Author: qiansc 
 * @Date: 2018-05-19 22:55:22 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-19 23:41:25
 */
/*
 * @Author: qiansc 
 * @Date: 2018-05-18 11:04:29 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-19 11:22:20
 */
const Pair = require('./pair');

class Json extends Pair {
    constructor (config) {
        super(config);
    }
    deal (part) {
        try{
            let json = JSON.parse(part);
            let result = [];
            Object.keys(json).forEach(key => {
                result.push([key, json[key].toString()]);
            });
            return result;
        } catch (e) {
            return false;
        }
    }
}

module.exports = Json;