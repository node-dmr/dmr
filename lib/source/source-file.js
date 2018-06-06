/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-03 15:43:16
 */
var http = require('http')
var qs=require('querystring');
var path=require('path');
var fs=require('fs');
var env = require('../core/env');
var Log =require('../util/log');
var Source = require('../source/source');
var File = require('../util/file');
var RangeFormatter = require('../formatter/formatter-range');
var log = new Log(5);

class FileSource extends Source{
    constructor(config){
        super(config);
        this.parser;
    }
    createWriteStream (option){
        option.file = option.output;
        let file = this.getFile(option);
        // 获取文件目录，不存在则创建
        var baseUrl = path.dirname(file);
        if (!fs.existsSync(baseUrl)) {
            File.mkdirsSync(baseUrl);
        }

        var encoding = 'utf-8';
        if (this.config.encoding !== undefined) {
            // 要兼容 null encoding
            encoding = this.config.encoding;
        }
        // 如果文件创建成功则writer定向为文件写流
        var writer = fs.createWriteStream(file, {
            encoding: encoding
        });
        this.emit('create', file, writer);
        return writer;
    }
    createReadStream (option){
        option.file = option.input;
        let file = this.getFile(option);
        var encoding = 'utf-8';
        if (this.config.encoding !== undefined) {
            // 要兼容 null encoding
            encoding = this.config.encoding;
        }
        var bufferSize = (this.config["read-buffer-size"] || 10) * 1024;
        var reader = fs.createReadStream(file, {
            encoding: encoding,
            highWaterMark: bufferSize
        });
        // console.log('read', file);
        this.emit('create', file, reader);
       return reader;
    }
    readSync(option){
        let file = this.getFile();
        var txt = fs.readFileSync(file, {
            encoding: 'utf-8'
        });
        return txt;
    }


    getFile (option) {
        var file;
        if (option.file === undefined || option.file === "default") {
            // 文件名不存在则生成
            if(!this.config.path){
                throw new Error('No Default FilePath Config!');
            }
            if(!option.range){
                throw new Error('No Default FilePath Config!');
            }
            // 有config.path 及 option.range 生成file
            file = path.resolve(env.root ,this.config.path);
            var formatter = new RangeFormatter(option.range);
            file = formatter.format(file);
        } else {
            file = option.file;
        }
        return file;
    }

}

module.exports = FileSource;