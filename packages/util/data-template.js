/*
 * @Author: qiansc 
 * @Date: 2018-04-08 15:48:42 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-09 21:26:04
 */

 module.exports = parse;

 function parse(target, data) {
    if (typeof target === "object"){
        return parseJsonObject(target, data);
    } else if (typeof target === "string") {
        return parseString(target, data);
    }
 }

 function parseJsonObject(target, data){
    for (var key in target){
        var item = target[key];
        target[key] = parse(item, data);
    }
    return target;
 }

 function parseString(string, data){
    return string
    .replace(/(\{\{[^\}]*\}\})/g, function (part) {
        part = substitute(part, data);
        part = part.substring(2,part.length-2);
        return eval('(' + part + ')');
    }).replace(/(\{[^\}]*\})/g, function (part) {
        part = substitute(part, data);
        part = part.substring(1,part.length-1);
        if (part.indexOf('{') === 0){
            return eval('(' + part + ')');
        } else {
            return part;
        }
    });
 }
 function substitute(string, data){
    return string.replace(/(\$[\w\-]*)/g, function(value){
        key = value.substring(1);
        if (data[key]) {
            if (typeof data[key] === 'object') {
                return JSON.stringify(data[key]);
            } else {
                return data[key].toString();
            }
            
        } else {
            return '"' + value +'"';
        }
    });
 }


 /**
  *         "param": {
                "starttimestamp": "{{Math.round($starttimestamp/1000)}}",
                "endtimestamp": "{{Math.round($endtimestamp/1000)}}",
                "from": "search_ac.log,get_doc_ac.log"
            }
  */