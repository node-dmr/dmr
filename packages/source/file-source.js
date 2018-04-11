/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 21:28:08
 */
var http = require('http')
var qs=require('querystring');
var path=require('path');
var fs=require('fs');
var env = require('../core/env');
var Log =require('../util/log');
var Source = require('../core/source');
var Time = require('../util/time');
var dtpl= require('../util/data-template');
var file = require('../util/file');
var log = new Log(5);

class FileSource extends Source{
    constructor(config){
        super(config);
    }
    createWriteStream (file){
        if (file == 'default'){
            if (this.config.path) {
                file = path.resolve(env.root ,this.config.path);
            } else {
                throw new Error('No Default FilePath Config!');
            }
        }

        var pathParam = Time.parseParam(
            new Date(this.option.startTimeStamp),
            new Date(this.option.endTimeStamp)
        );
        file = dtpl(file, pathParam);

        // 获取文件目录，不存在则创建
        var baseUrl = path.dirname(file);
        if (!fs.existsSync(baseUrl)) {
            file.mkdirsSync(baseUrl);
        }

        // 如果文件创建成功则writer定向为文件写流
        var writer = fs.createWriteStream(file, {
            encoding: 'utf8'
        });
        
        log.warn('L1', '[save] ' , file);
        return writer;
    }
}

module.exports = FileSource;