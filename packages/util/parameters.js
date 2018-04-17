/*
 * @Author: qiansc 
 * @Date: 2018-04-17 12:28:01 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 15:51:24
 */

class Parameters {
    constructor (param) {
        param = param || {};
        this.paramList = {};
        this.option = {};
        // this.paramList.forEach((name) =>{
        //     this.set(name, param[name]);
        // });
        for (var name in param) {
            this.set(name, param[name]);

        }
    }
    set (name, value, opt) {
        var option = name;
        if (typeof option === "object") {
            // 重载
            name = option.name;
            value = option.value;
        }
        // 注册属性
        this.option[name] = opt || {};
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