/*
 * @Author: qiansc 
 * @Date: 2018-06-25 18:22:53 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-28 17:29:31
 */
const Model = require('./model');

class Conditions extends Model{
    constructor (data) {
        if (typeof data === "string") {
            data =  JSON.parse(data);
        }
        super();
        this.model = [];
        data.forEach(item => {
            this.model.push(item);
        });
    }
    keys() {
        let keys = [];
        this.model.forEach(item => {
            keys.push(item.k);
        });
        return keys;
    }
    get(key) {
        let result = [];
        this.model.forEach(item => {
            if (item.k === key) {
                result.push(item);
            }
        });
        return result.length > 1 ? result : (result[0] || null);
    }
    val(key) {
        let result = [];
        this.model.forEach(item => {
            if (item.k === key) {
                result.push(item.v);
            }
        });
        return result.length > 1 ? result : (result[0] || null);
    }
    param() {
        let param = {};
        this.keys().forEach(key => {
            param[key] = this.val(key);
        });
        return param;
    }
}

module.exports = Conditions;