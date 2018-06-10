/*
 * @Author: qiansc 
 * @Date: 2018-06-10 22:09:47 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-10 23:26:02
 */
const Config = require('../core/config.js');
const hash = require('object-hash');
const ns = require('node-schedule');

class Schedule {
    constructor (key) {
        let conf = Schedule.getConf(key);
        if (!conf) {
            this.disabled = true;
            console.warn('Can not find Config of key[%s]!', key);
            return;
        }
        console.log('!!!!', key, conf.crontab);
        var j = ns.scheduleJob(conf.crontab, function(fireDate){
            console.log('ran at ' + new Date());
            try{
                console.log(kk);
            }catch(e){

            }
        });
        var j = ns.scheduleJob('*/30 * * * * *', function(fireDate){
            console.log('ran2 at ' + new Date());
            try{
                console.log(kk);
            }catch(e){

            }
        });
        
    }
    static getConf(key) {
        let config = false;
        let list = Schedule.list();
        list.forEach(conf => {
            if (conf.key === key) {
                config = conf;
            }
        });
        return config;
    }
    static list () {
        let confs = Config.get('schedule');
        let list = getSchedule(confs);
        list = normalize(list);
        return list;
    }
}

module.exports = Schedule;

function getSchedule (conf, scope) {
    scope = scope || ['root'];
    let list = [];
    if (typeof conf === "object") {
        if (conf.crontab) {
            conf.scope = scope.join('-');
            list.push(conf);
            // should be crontab config!
        } else {
            Object.keys(conf).forEach(key => {
                list = list.concat(getSchedule(conf[key], scope.concat([key])));
            });
        }
    } else {
        // do nothing!
    }
    return list;
}

function normalize (confs) {
    confs.forEach(conf => {
        conf.disabled = conf.disabled === "true" ? true : false;
        conf.md5 = hash(conf);
        conf.key = conf.key || hash(conf.scope).substring(0,4);
    });
    return confs;
}