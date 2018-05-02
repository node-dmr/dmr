/*
 * @Author: qiansc 
 * @Date: 2018-05-02 08:39:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-02 10:17:51
 */
var ActionLog = require('../core/action-log');
var RandomKey = require('../util/random-key');
var Log = require('../util/log');
var log = new Log(5);

ActionImplements = {
    // 获得按action-param过滤的可用param
    actionParam: function (){
        var ap = {};
        var list = this.config && this.config["action-param"] || Object.keys(this._action);
        list.forEach(key => {
            if (key !== "config") {
                ap[key] = this._action[key];
            }
        });
        return ap;
    },
    // 设置action 分离config
    setAction: function(action) {
        this._action = action || {};
        this.config = action.config || {};
        this.actionParam = this.actionParam();
    },
    setActionParam: function(actionParam) {
        this._action = actionParam;
        this.actionParam = this.actionParam();
    },
    enableActionLog: function (id) {
        // 启用接受到end事件时记录日志功能
        var key = new RandomKey().get();
        if (this.on) {
            this.on('end',() =>{
                ActionLog.add(key, id, this._action.stringify());
                log.info('L5', 'You can [restart this job / start next job] by using Action Key : -k ' + key);
            });
        }
    }
}

module.exports = {
    applyOn: function(target) {
        Object.assign(target, ActionImplements);
    }
};