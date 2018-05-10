/*
 * @Author: qiansc 
 * @Date: 2018-04-03 17:48:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-08 00:17:15
 * 读取配置文件
 * 读取模块安装目录../../config/main.conf
 * 读取主Project目录下/config所有配置
 */

var path = require('path');
var Log = require('../util/log');
var log = new Log(5);
var File = require('../util/file');
var enviromentConfig = require('./enviroment-config').config;

var projectId = null;

if(process && process.argv){
    process.argv.forEach(
        (param , i) => {
            if(param === '-p' && process.argv[i+1]){
                projectId = process.argv[i+1];
            }
        }
    );
}

var projectConfig = getProjectConfig(projectId || enviromentConfig["base-project"]);



var env = projectConfig;


// 获取base-project configs
var configPath = path.resolve(env.root, 'config');
var fileList = File.listSync(configPath);

fileList.forEach(
    (filePath)=>{
    var data = File.readJsonSync(filePath);

    var attr = TransPathToAttr(configPath, filePath);

    var arr = attr.split('.');
    var target = env;
    for(var i = 0; i < arr.length; i++) {
        var value = target[arr[i]] || {};
        target[arr[i]] = value;
        target = target[arr[i]];
    }
    for(var key in data){
        target[key] = data[key];
    }
});

env = redirectPathConfig(env, "config");

// 实现软连接 "./"
function redirectPathConfig(config, deep) {
    deep = deep || 0;
    deep ++;
    if (deep > 10) {
        return "two deep for redirect";
    }
    Object.keys(config).forEach(key => {
        var target = config[key];
        if (Array.isArray(target)){
            // 目标是数组对象的处理
            target.forEach((item, index) => {
                if (typeof item === "string") {
                    config[key][index] = dealString(item);
                }
            });
        }else if (target && typeof target === "object") {
            config[key] = redirectPathConfig(target, deep);
        } else if (typeof target === "string") {
            config[key] = dealString(target);
        }
    });

    function dealString(target){
            if (target.indexOf('config/') === 0 ){
                let arr = target.split(/[\/|\.]/);
                arr.shift(0);
                target = getConfigByAttrs.apply(this,arr);
                if (target && typeof target === "object") {
                    target = redirectPathConfig(target, deep);
                }
            }
        return target;
    }

    function getConfigByAttrs(){
        var arr = [].slice.call(arguments);
        arr = arr.join('.').split('.');
        var con = env;
        for(var i = 0;i < arr.length; i++ ){
            con = con && con[arr[i]] || false;
        }
        return con || false;
    }
    return config;
}



log.info('L9','Enviroment', JSON.stringify(env));

// 避免config被篡改
const Enviroment = env;
module.exports = Enviroment;

function TransPathToAttr (configPath, filePath) {
    var path = filePath.substring(configPath.length + 1);
    path = path.replace(/[\\|\/]/g,'.').replace(/\.(conf|json)/g,'');
    return path;
}


function getProjectConfig(projectId){
    // 获取并验证base-project
    var projectConfig = enviromentConfig[projectId];
    if (!projectConfig || !projectConfig.root) {
        log.warn(projectId + ' config is not exist!');
        throw new Error(projectId + ' config is not exist!');
        return false;
    }
    return projectConfig;
}