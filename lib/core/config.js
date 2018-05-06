/*
 * @Author: qiansc 
 * @Date: 2018-04-03 17:48:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-01 23:45:59
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
    static find(){
        var arr = [].slice.call(arguments);
        var key = arr.pop(0);
        var result =  false;
        keys(env, function (target, path) {
            var tkey = path.pop(0);
            if (tkey === key) {
                var re = new RegExp(arr.join('[\\w\\w]+'));
                if(path.join(".").match(re)) {
                    result = target;
                }
            }
        });
        return result;
    }
}

function keys(target, cb, path){
    path = path || [];
    if(target && typeof target === "object" && !Array.isArray(target)) {
        cb(target,path.slice(0));
        Object.keys(target).forEach(key => {
            let nextpath = path.slice(0);
            nextpath.push(key);
            keys(target[key], cb, nextpath);
        });
    } else {
        cb(target,path.slice(0));
    }
}

module.exports = Config;