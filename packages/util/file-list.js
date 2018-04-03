/*
 * @Author: qiansc 
 * @Date: 2018-04-03 18:12:08 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-03 18:29:09
 */

var fs = require('fs');  
var path = require('path');
var Log =require('../util/log');
var log = new Log(8); 

module.exports = FileList;

function FileList (filePath, func) {
    if (typeof func === 'function') {
        // 异步方式回调
        fileDisplay(filePath, func);
    } else {
        return fileDisplaySync(filePath);
    }
}

 /** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */  
function fileDisplaySync(filePath){
    var list = [];
    //根据文件路径读取文件，返回文件列表  
    var files = fs.readdirSync(filePath);
    files.forEach(function(filename){
        //获取当前文件的绝对路径  
        var filedir = path.join(filePath,filename);  
        //根据文件路径获取文件信息，返回一个fs.Stats对象  
        var stats = fs.statSync(filedir)
        var isFile = stats.isFile();//是文件  
        var isDir = stats.isDirectory();//是文件夹  
        if (isFile) {  
            list.push(filedir);
        } else if(isDir){
            //递归，如果是文件夹，就继续遍历该文件夹下面的文件  
            var rs = fileDisplaySync(filedir);
            list = list.concat(rs);
        }
    });
    return list;
}


function fileDisplay(filePath){  
    //根据文件路径读取文件，返回文件列表  
    fs.readdir(filePath,function(err,files){  
        if(err){  
            log.warn('L1', err)  
        }else{  
            //遍历读取到的文件列表  
            files.forEach(function(filename){  
                //获取当前文件的绝对路径  
                var filedir = path.join(filePath,filename);  
                //根据文件路径获取文件信息，返回一个fs.Stats对象  
                fs.stat(filedir,function(eror,stats){  
                    if(eror){  
                        log.warn('L1', '获取文件stats失败');  
                    }else{  
                        var isFile = stats.isFile();//是文件  
                        var isDir = stats.isDirectory();//是文件夹  
                        if(isFile){  
                            log.info(filedir);  
                        }  
                        if(isDir){  
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                        }  
                    }  
                })  
            });  
        }  
    });  
}