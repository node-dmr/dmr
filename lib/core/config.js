/*
 * @Author: qiansc 
 * @Date: 2018-04-03 17:48:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 16:41:10
 */

const Enviroment = require('../core/env');
let env;

class Config{
    static get(){
        let arr = [].slice.call(arguments);
        arr = arr.join('.').split('.');
        env = env || Enviroment.get();
        let con = Enviroment.get();
        for(let i = 0;i < arr.length; i++ ){
            con = con && con[arr[i]] || false;
        }
        return con || false;
    }
    static find(){
        let arr = [].slice.call(arguments);
        let key = arr.pop(0);
        let result =  false;
        env = env || Enviroment.get();
        keys(env, function (target, path) {
            let tkey = path.pop(0);
            if (tkey === key) {
                let re = new RegExp(arr.join('[\\w\\w]+'));
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