/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-07-17 19:15:23
 */

var util = require('util');
var Transform = require('../pipeline/transform');
var MiddleWareFactory = require('../middleware/factory');

class ExtractTransform extends Transform {
    constructor(config) {
        config.objectMode = true;
        config.type = config.type || "black";
        config["conditions"] = config["conditions"] || [];
        super(config);
        // Preprocessing conditions
        this._normalizeCondition(config["conditions"]);
        
        var partten = config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
        }

    }
    _transform(result, encoding, callback) {
        let conditions = this.config["conditions"];
        let type = this.config.type == "white" ? "white" : "black";
        let handle = this.config.handle;// == "field" ? "field" : "line";
        let keys = result.keys();
        if (handle === "result") {
            let linemark = type == "white" ? false : true;
            conditions.forEach(condition => {
                let fields = condition.fields === "all" ? keys : condition.fields;
                let check = true;
                for (var i = 0; i < fields.length; i++) {
                    if (this.check(condition, result.get(fields[i])) !== true) {
                        check = false;
                        break;
                    }
                }
                if(this.config.type === "white" && check === true) {
                    linemark = true;
                }
                if(this.config.type === "black" && check === true) {
                    linemark = false;
                }
            });
            if (linemark === true) {
                this.push(result);
            }
        } else if (handle === "field") {
            let list = {};
            keys.forEach(key => {
                list[key] = this.config.type == "white" ? false : true;
            })
            conditions.forEach(condition => {
                let fields = condition.fields === "all" ? keys : condition.fields;
                fields.forEach(key => {
                    let check = this.check(condition, result.get(key));
                    if (this.config.type === "white" && check === true) {
                        list[key] = true;
                    } else if (this.config.type === "black" && check === true) {
                        list[key] = false;
                    }
                });
            });
            keys.forEach(key => {
                if (list[key] === false) {
                    result.predel(key);
                }
            });
            result.del();
            if (result.length) {
                this.push(result);
            }
        } else if (handle === "line") {
            if (this.config.exist) {
                let check = result.indexOf(this.config.exist) > -1;
                if (check) {
                    if (type === "white") {
                        this.push(result);
                    }
                    callback();
                    return;
                }
            }
            if (this.partten) {
                let check = result.toString().match(this.partten);
                if (check) {
                    if (type === "white") {
                        this.push(result);
                    }
                    callback();
                    return;
                }
            }
            if (type !== "white") {
                this.push(result);
            }
        }
        callback();
    }
    check(condition, value) {
        let rs = true;
        ["_gt", "_eq", "_lt", "_gt_eq", "_lt_eq", "_match", "_not_match", "_not_eq"].forEach(method => {
            rs = rs && this[method](condition, value);
        });
        return rs;
    }
    _gt(condition, value) {
        if (condition["gt"]  !== undefined){
            if (value > condition["gt"]) {
                return true;
            }
            return false;
        }
        return true;
    }
    _eq(condition, value) {
        if (condition["eq"]  !== undefined){
            if (value === condition["eq"]) {
                return true;
            }
            return false;
        }
        return true;
    }
    _lt(condition, value) {
        if (condition["lt"]  !== undefined){
            if (value < condition["lt"]) {
                return true;
            }
            return false;
        }
        return true;
    }
    _gt_eq(condition, value) {
        if (condition["gt-eq"]  !== undefined){
            if (value >= condition["gt-eq"]) {
                return true;
            }
            return false;
        }
        return true;
    }
    _lt_eq(condition, value) {
        if (condition["lt-eq"]  !== undefined){
            if (value <= condition["lt-eq"]) {
                return true;
            }
            return false;
        }
        return true;
    }
    _match(condition, value) {
        if (condition["match"]  !== undefined){
            for (let i = 0; i < condition["match"].length; i++) {
                if (condition["match"][i] === value) return true;
            }
            return false;
        }
        return true;
    }
    _not_match(condition, value) {
        if (condition["not-match"]  !== undefined){
            for (let i = 0; i < condition["not-match"].length; i++) {
                if (condition["not-match"][i] === value) return false;
            }
            return true;
        }
        return true;
    }
    _not_eq(condition, value) {
        if (condition["eq"]  !== undefined){
            if (value !== condition["eq"]) {
                return true;
            }
            return false;
        }
        return true;
    }
    _normalizeCondition(conditions) {
        conditions.forEach(condition => {
            if (!condition.fields) {
                condition.fields = [];
            }
            if (typeof condition.field === "string") {
                condition.fields = [condition.field];
            }
            if (condition["match"]) {
                if (!Array.isArray(condition["match"])){
                    condition["match"] = [condition["match"]];
                }
                condition["match"] = replaceUndefined(condition["match"]);
            }
            if (condition["not-match"]) {
                if (!Array.isArray(condition["not-match"])){
                    condition["not-match"] = [condition["not-match"]];
                }
                condition["not-match"] = replaceUndefined(condition["not-match"]);
            }
        });

        function replaceUndefined(c) {
            c.forEach((item, index) => {
                if (item === "undefined") {
                    c[index] = undefined;
                }
            });
            return c;
        }
    }
}

module.exports = ExtractTransform;