/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-18 00:47:09
 */
var http = require('http')
var qs=require('querystring');
var path=require('path');
var fs=require('fs');
var env = require('../core/env');
var Log =require('../util/log');
var Source = require('../core/source');
var File = require('../util/file');
var RangeFormatter = require('../formatter/range-formatter');
var log = new Log(5);

class FileSource extends Source{
    constructor(config){
        super(config);
        this.parser;
    }
    createWriteStream (){
        var file = this.option.file;
        if (file == 'default'){
            if (this.config.path) {
                file = path.resolve(env.root ,this.config.path);
            } else {
                throw new Error('No Default FilePath Config!');
            }
        }
        if (this.option.range) {
            var formatter = new RangeFormatter(this.option.range);
            file = formatter.format(file);
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
        this.emit('create', file, writer);
        return writer;
    }
    createReadStream (){
        var file;
        if (this.option.file === undefined || this.option.file === "default") {
            // 文件名不存在则生成
            if(!this.config.path){
                throw new Error('No Default FilePath Config!');
            }
            if(!this.option.range){
                throw new Error('No Default FilePath Config!');
            }
            // 有config.path 及 option.range 生成file
            file = path.resolve(env.root ,this.config.path);
            var formatter = new RangeFormatter(this.option.range);
            file = formatter.format(file);
        } else {
            file = this.option.file;
        }
        var bufferSize = (this.config["read-buffer-size"] || 10) * 1024;
        var reader = fs.createReadStream(file, {
            encoding: 'utf8',
            highWaterMark: bufferSize
        });
        this.emit('create', file, reader);
        return reader;
    }

}

module.exports = FileSource;