/*
 * @Author: qiansc 
 * @Date: 2018-04-17 12:28:01 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 20:37:26
 */

class Parameters {
    constructor (param) {
        this.paramList = {};
        this.option = {};
        param = param || {};
        this.set(param);
    }
    set (name, value) {
        var option = name;
        if (typeof option === "object") {
            // 重载
            for (var name in option){
                this.set(name, option[name]);
            }
            return;
        }
        // 注册属性
        this.option[name] = {};
        this.paramList[name] = true;
        this[name] = value;
    }
    param () {
        var result = {};
        for (var name in this.paramList){
            result[name] = this[name];
        }
        return result;
    }
}

module.exports = Parameters;