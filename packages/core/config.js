/*
 * @Author: qiansc 
 * @Date: 2018-04-03 17:48:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 20:18:58
 */

var env = require('../core/env');

class Config{
    static get(){
        var arr = [].slice.call(arguments);
        arr = arr.join('.').split('.');
        var con = env;
        for(var i = 0;i < arr.length; i++ ){
            con = con && con[arr[i]] || false;
        }
        return con || false;
    }
}

module.exports = Config;