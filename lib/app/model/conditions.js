/*
 * @Author: qiansc 
 * @Date: 2018-06-25 18:22:53 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-26 12:59:56
 */
class Conditions extends Array{
    constructor (data) {
        if (typeof data === "string") {
            data =  JSON.parse(data);
        }
        super();
        data.forEach(item => {
            this.push(item);
        });
    }
    keys() {
        let keys = [];
        this.forEach(item => {
            keys.push(item.k);
        });
        return keys;
    }
    get(key) {
        let result = [];
        this.forEach(item => {
            if (item.k === key) {
                result.push(item);
            }
        });
        return result.length > 1 ? result : (result[0] || null);
    }
    val(key) {
        let result = [];
        this.forEach(item => {
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