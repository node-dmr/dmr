/*
 * @Author: qiansc 
 * @Date: 2018-04-08 15:48:42 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-08 19:06:52
 */

 module.exports = function (template, data) {
    for (var key in template){
        var string = template[key];
        template[key] = exeScript(string, data);
    }
    return template;
 }

 function exeScript(string, data){
    return string.replace(/(\{\{[^\}]*\}\})/g, function (part) {
        part = part.replace(/(\$[\w\-]*)/g, function(value){
            value = value.substring(1);
            return data[value];
        });
        part = part.substring(2,part.length-2);
        return eval('(' + part + ')');
    });
 }

 /**
  *         "param": {
                "starttimestamp": "{{Math.round($starttimestamp/1000)}}",
                "endtimestamp": "{{Math.round($endtimestamp/1000)}}",
                "from": "search_ac.log,get_doc_ac.log"
            }
  */