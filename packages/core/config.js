/*
 * @Author: qiansc 
 * @Date: 2018-04-03 17:48:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 16:05:21
 */

var env = require('../core/env');

class Config{
    static get(){
        var arr = [].slice.call(arguments);
        var itemId = arr.pop();
        var con = env;
        for(var i = 0;i < arr.length; i++ ){
            con = con && con[arr[i]] || false;
        }
        return con && con && con[itemId] || false;
    }
}

module.exports = Config;