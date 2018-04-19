/*
 * @Author: qiansc 
 * @Date: 2018-04-17 20:51:54 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-19 17:31:09
 */
 var Log = require('../../packages/util/log');
 var ActionLog = require('../../packages/core/action-log');
 var Action = require('../../packages/core/action');
 var log = new Log(2);

 module.exports = function(key){
     var rs = ActionLog.getLogByKey(key);
     if(rs && rs.action){
        log.info('ID-Key '+rs.id+'-'+ key +'');
        return new Action(rs.action);
     }
     return false;
 }