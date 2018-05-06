/*
 * @Author: qiansc 
 * @Date: 2018-04-26 00:12:28 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-26 20:30:22
 */
var Transform = require('../pipeline/transform');
var util = require('util');

class ExportTransform extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
        super(config);
        this.dimConfig = preprocess(config.dims);
        // console.log(JSON.stringify(this.dimConfig));
    }
    _transform(data, encoding, callback){
        this.dimConfig.forEach(conf => {
            var dimName = getDimName(conf.dim, data);
            // "field":[["lookup",{}],["waiting"]...["appcache"],["connect"],["domReady"]]
            conf.field.forEach(f => {
                // f[1] 是配置，暂不实现
                // f[0] 是filedName
                if (f[1] && f[1].necessary && !data[f[0]]) {
                    // 举例 存在filed.necessary 配置，且data数据为空
                    // do nothing
                }else{
                    // console.log({
                    //     "dim": dimName,
                    //     "field": f[0],
                    //     "value": data[f[0]]
                    // });
                    // var result = {
                    //     "dim": dimName,
                    //     "field": f[0],
                    //     "value": data[f[0]]
                    // };
                    this.push([dimName + '|' + f[0], data[f[0]]]);
                }
            });
        });
        // console.log('+', array);
        callback();
    }
}

module.exports = ExportTransform;

// config的预处理
function preprocess(dimConfig) {
    var fast = {};
    dimConfig.forEach(conf => {
        if (typeof conf.dim === "string") {
            conf.dim = [conf.dim];
        }
        // dim config 格式化为标准[dim-name,option]格式
        conf.dim.forEach((d,i) =>{
            if (typeof d === "string") {
                conf.dim[i] = [d];
            } else if(!Array.isArray(d)) {
                throw new Error('Illegal Dim Config ' + d);
            }
        });
        // dim-field config 格式化为标准[field-name,option]格式
        Array.isArray(conf.field) && conf.field.forEach((d ,i)=>{
            if (typeof d === "string") {
                d = [d];
            } else if(!Array.isArray(d)) {
                throw new Error('Illegal Field Config ' + d);
            }
            if (conf["default-field-config"]){
                d[1] = d[1] || {};
                d[1] = Object.assign(d[1], conf["default-field-config"]);
            }
            conf.field[i] = d;
        });
        // 存在id 则建立映射 便于后续复制属性
        if (conf.id) {
            fast[conf.id] = conf;
        }
        // 复制field属性 same as id
        if (conf.field && typeof conf.field === "string") {
            var match = conf.field.match(/same\sas\s(\S+)/);
            conf.field = fast[match[1]].field || [];
        }
    });
    return dimConfig;
}

function getDimName (dim, data) {
    // "dim":[["all"]]
    var result = [];
    dim.forEach(arr => {
        var dimName = arr[0];
        var value = data[dimName] || 'null';
        value = value.replace(/\|\=/g,'$');
        if (dimName == "all") {
            result.push('all');
        } else {
            result.push(dimName + '=' + value);
        }
        // config 是 arr[1] 暂不实现
    });
    return result.join('|');
}