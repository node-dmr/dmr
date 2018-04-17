/*
 * @Author: qiansc 
 * @Date: 2018-04-17 18:18:47 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 19:46:02
 */
var env = require('../core/env');
var TimeFormatter = require('../formatter/time-formatter');

 // 没有考虑清楚怎么抽象，先把ActionLog解耦出来，后续调整模式
 class ActionLog{
    static add(key, id , action){
        var path=require('path');
        var fs=require('fs');
        var filename = TimeFormatter.format('YYYYMMDD.task.log');
        var file = path.resolve(env.root , 'log\\' + filename);
        // 获取文件目录，不存在则创建
        var baseUrl = path.dirname(file);
        if (!fs.existsSync(baseUrl)) {
            File.mkdirsSync(baseUrl);
        }
        fs.appendFileSync(file, id + '\t' + key + '\t'+ action + '\n');
    }
 }

 module.exports = ActionLog;