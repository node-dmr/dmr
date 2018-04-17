/*
 * @Author: qiansc 
 * @Date: 2018-04-17 18:18:47 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 21:15:11
 */
var path=require('path');
var fs=require('fs');
var env = require('../core/env');
var TimeFormatter = require('../formatter/time-formatter');

 // 没有考虑清楚怎么抽象，先把ActionLog解耦出来，后续调整模式
 class ActionLog{
    static add(key, id , action){

        var filename = TimeFormatter.format('YYYYMMDD.task.log');
        var file = path.resolve(env.root , 'log\\' + filename);
        // 获取文件目录，不存在则创建
        var baseUrl = path.dirname(file);
        if (!fs.existsSync(baseUrl)) {
            File.mkdirsSync(baseUrl);
        }
        fs.appendFileSync(file, id + '\t' + key + '\t'+ action + '\n');
    }
    static getLogByKey(key){
        var time = new Date().getTime();
        var rs;
        for (var day = 0; day < 3; day++){
            // 倒推三天日志，查找最近的key
            var t = new Date(new Date().getTime() - 1000*3600*24*day);
            var filename = TimeFormatter.format('YYYYMMDD.task.log',t);
            var data = getDayLog(filename);
            if (data && data.indexOf(key)) {
                var lines= data.split('\n');
                for (var j = lines.length-1; j >= 0; j--){
                    var line = lines[j].split('\t');
                    if (line[1] === key){
                        return {
                            id: line[0],
                            key: line[1],
                            action: JSON.parse(line[2])
                        };
                    }
                }
            }
        }
        throw new Error('Can`t Find Key in Log!');
        return false;
    }
 }

 function getDayLog(filename){
    var file = path.resolve(env.root , 'log\\' + filename);
    if (!fs.existsSync(file)) {
        return false;
    }
    var data = fs.readFileSync(file,'utf-8');
    return data;
 }

 module.exports = ActionLog;