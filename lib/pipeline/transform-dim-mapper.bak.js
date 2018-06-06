/*
 * @Author: qiansc 
 * @Date: 2018-04-26 00:12:28 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-02 17:46:47
 */
var Transform = require('../pipeline/transform');
var Result = require('../entity/result');
var util = require('util');

class ExportTransform extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
        super(config);
        this.dimConfig = preprocess(config.dims);
        // console.log(JSON.stringify(this.dimConfig));
    }
    _transform(result, encoding, callback){
        this.dimConfig.forEach(conf => {
            var dimName = getDimName(conf.dim, result);
            // "fields":[["lookup",{}],["waiting"]...["appcache"],["connect"],["domReady"]]
            conf.fields.forEach(f => {
                // f[1] 是配置，暂不实现
                // f[0] 是filedName
                if (f[1]) {
                // if (f[1] && f[1].necessary && !result.get([f[0]])) {
                    // 举例 存在filed.necessary 配置，且data数据为空
                    // do nothing
                } else {
                    let m = new Result();
                    m.set("key", dimName + '|' + f[0]);
                    m.set("value", result.get(f[0]));
                    this.push(m);
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
        Array.isArray(conf.fields) && conf.fields.forEach((d ,i)=>{
            if (typeof d === "string") {
                d = [d];
            } else if(!Array.isArray(d)) {
                throw new Error('Illegal Field Config ' + d);
            }
            if (conf["default-field-config"]){
                d[1] = d[1] || {};
                d[1] = Object.assign(d[1], conf["default-field-config"]);
            }
            conf.fields[i] = d;
        });
        // 存在id 则建立映射 便于后续复制属性
        if (conf.id) {
            fast[conf.id] = conf;
        }
        // 复制field属性 same as id
        if (conf.fields && typeof conf.fields === "string") {
            var match = conf.fields.match(/same\sas\s(\S+)/);
            conf.fields = fast[match[1]].field || [];
        }
    });
    return dimConfig;
}

function getDimName (dim, result) {
    // "dim":[["all"]]
    var name = [];
    dim.forEach(arr => {
        var dimName = arr[0];
        var value = result.get(dimName) || 'null';
        value = value.replace(/\|\=/g,'$');
        if (dimName == "all") {
            name.push('all');
        } else {
            name.push(dimName + '=' + value);
        }
        // config 是 arr[1] 暂不实现
    });
    return name.join('|');
}