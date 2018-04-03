/*
 * @Author: qiansc 
 * @Date: 2018-04-03 17:48:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-03 19:22:03
 */

var fs = require('fs');  
var path = require('path');
var Log =require('../util/log');
var FileList =require('../util/file-list');

var log = new Log(5); 
var configPath = path.resolve(__dirname , '../../config/');

var fileList = FileList(configPath);
var config = {};

fileList.forEach(
    (filePath)=>{
    var txt = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    });

    try{
        var data = JSON.parse(txt);
    }catch(e){
        var data = "";
        log.warn('L9', e);
    }
    var attr = TransPathToAttr(configPath, filePath);
    var arr = attr.split('.');
    var target = config;
    for(var i = 0; i < arr.length; i++) {
        var value = target[arr[i]] || {};
        target[arr[i]] = value;
        target = target[arr[i]];
    }
    for(var key in data){
        target[key] = data[key];
    }
});

log.info('L9','Config', JSON.stringify(config));
function TransPathToAttr (configPath, filePath) {
    var path = filePath.substring(configPath.length + 1);
    path = path.replace(/[\\|\-]/g,'.').replace(/\.conf/g,'');
    return path;
}

function contactAttr (obj , attr , target) {
    obj[attr] = target;
    return obj;
}


const Config = config;
module.exports = Config;