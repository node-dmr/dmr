/*
 * @Author: qiansc 
 * @Date: 2018-06-10 22:09:47 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 02:08:02
 */
const TimeFormatter = require('../formatter/formatter-time');
const Config = require('../core/config.js');
const hash = require('object-hash');
const ns = require('node-schedule');
const Runner = require('../task/runner');

class Schedule {
    constructor (key) {
        let conf = Schedule.getConf(key);
        if (!conf) {
            this.disabled = true;
            console.warn('Can not find Config of key[%s]!', key);
            return;
        } else if (conf.disabled) {
            this.disabled = true;
            console.warn('Disabled Config of key[%s]!', key);
            return;
        }
        this.conf = conf;
    }
    start () {
        if (this.disabled) return;
        let conf = this.conf;
        let job = ns.scheduleJob(conf.crontab, fireDate => {
            let cmd = conf.cmd;
            cmd = cmd.replace(/\{\$now\}/g, TimeFormatter.format('YYYYMMDDhhmmss')).replace(/\{\$fireDate\}/g, TimeFormatter.format('YYYYMMDDhhmmss', fireDate));
            cmd = cmd.split(' ');
            switch(cmd[1]) {
                case "run":
                    cmd[0] = process.argv[0];
                    let dir = process.cwd();
                    try{
                    let runner = new Runner(cmd, dir);
                        runner.exe();
                    }catch(e) {
                        // console.log(e);
                    }
                    break;
                default:
                    break;
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