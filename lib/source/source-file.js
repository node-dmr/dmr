/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 16:33:47
 */
let http = require('http')
let qs=require('querystring');
let path=require('path');
let fs=require('fs');
let Enviroment = require('../core/env');
let env;
let Log =require('../util/log');
let Source = require('../source/source');
let File = require('../util/file');
let RangeFormatter = require('../formatter/formatter-range');
let log = new Log(5);

class FileSource extends Source{
    constructor(config){
        super(config);
        this.parser;
    }
    createWriteStream (option){
        option.file = option.output;
        let file = this.getFile(option);
        // 获取文件目录，不存在则创建
        let baseUrl = path.dirname(file);
        if (!fs.existsSync(baseUrl)) {
            File.mkdirsSync(baseUrl);
        }

        let encoding = 'utf-8';
        if (this.config.encoding !== undefined) {
            // 要兼容 null encoding
            encoding = this.config.encoding;
        }
        // 如果文件创建成功则writer定向为文件写流
        let writer = fs.createWriteStream(file, {
            encoding: encoding
        });
        this.emit('create', file, writer);
        return writer;
    }
    createReadStream (option){
        option.file = option.input;
        let file = this.getFile(option);
        let encoding = 'utf-8';
        if (this.config.encoding !== undefined) {
            // 要兼容 null encoding
            encoding = this.config.encoding;
        }
        let bufferSize = (this.config["read-buffer-size"] || 10) * 1024;
        let reader = fs.createReadStream(file, {
            encoding: encoding,
            highWaterMark: bufferSize
        });
        // console.log('read', file);
        this.emit('create', file, reader);
       return reader;
    }
    readSync(option){
        let file = this.getFile();
        let txt = fs.readFileSync(file, {
            encoding: 'utf-8'
        });
        return txt;
    }


    getFile (option) {
        let file;
        if (option.file === undefined || option.file === "default") {
            // 文件名不存在则生成
            if(!this.config.path){
                throw new Error('No Default FilePath Config!');
            }
            if(!option.range){
                throw new Error('No Default FilePath Config!');
            }
            env = env || Enviroment.get();
            // 有config.path 及 option.range 生成file
            file = path.resolve(env.root ,this.config.path);
            let formatter = new RangeFormatter(option.range);
            file = formatter.format(file);
        } else {
            file = option.file;
        }
        return file;
    }

}

module.exports = FileSource;