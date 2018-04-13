/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 15:00:30
 */
var http = require('http')
var qs=require('querystring');
var path=require('path');
var fs=require('fs');
var env = require('../core/env');
var Log =require('../util/log');
var Source = require('../core/source');
var File = require('../util/file');
var log = new Log(5);

class FileSource extends Source{
    constructor(config){
        super(config);
        this.formatter;
        this.parser;
    }
    setFilePathFormatter (formatter){
        this.formatter = formatter;
    }
    createWriteStream (file){
        if (file == 'default'){
            if (this.config.path) {
                file = path.resolve(env.root ,this.config.path);
            } else {
                throw new Error('No Default FilePath Config!');
            }
        }
        if (this.formatter){
            file = this.formatter.format(file);
        }
        
        // 获取文件目录，不存在则创建
        var baseUrl = path.dirname(file);
        if (!fs.existsSync(baseUrl)) {
            File.mkdirsSync(baseUrl);
        }

        // 如果文件创建成功则writer定向为文件写流
        var writer = fs.createWriteStream(file, {
            encoding: 'utf8'
        });
        
        log.warn('L1', '[save] ' , file);
        return writer;
    }
    createReadStream (file){
        if (file && this.formatter){
            var range
        }
    }
}

module.exports = FileSource;