/*
 * @Author: qiansc 
 * @Date: 2018-04-03 17:48:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 16:03:25
 * 读取配置文件
 * 读取模块安装目录../../config/main.conf
 * 读取主Project目录下/config所有配置
 */

var fs = require('fs');
var path = require('path');
var Log = require('../util/log');
var File = require('../util/file');
var log = new Log(5);
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


const mainConfigPath = path.resolve(__dirname , '../../config/enviroment.conf');
var mainConfig = File.readJsonSync(mainConfigPath);
var projectConfig = getProjectConfig(projectId || mainConfig["base-project"]);


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

log.info('L9','Enviroment', JSON.stringify(env));

// 避免config被篡改
const Enviroment = env;
module.exports = Enviroment;

function TransPathToAttr (configPath, filePath) {
    var path = filePath.substring(configPath.length + 1);
    path = path.replace(/[\\|\-]/g,'.').replace(/\.conf/g,'');
    return path;
}

function contactAttr (obj , attr , target) {
    obj[attr] = target;
    return obj;
}



function getProjectConfig(projectId){
    // 获取并验证base-project
    var projectConfig = mainConfig[projectId];
    if (!projectConfig || !projectConfig.root) {
        log.warn(projectId + ' config is not exist!');
        throw new Error(projectId + ' config is not exist!');
        return false;
    }
    return projectConfig;
}