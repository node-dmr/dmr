/*
 * @Author: qiansc 
 * @Date: 2018-05-06 20:08:15 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-08 00:08:13
 */
const path = require('path');
const fs = require('fs');  
const File = require('../util/file');
const Log = require('../util/log');
const confirm = require('./user-input').confirm;
const input = require('./user-input').input;
const log = new Log(5);
const ec = require('../core/enviroment-config');
const enviromentConfig = ec.config;



function exec (dir, cmd) {
    let cwdDir = path.resolve(process.cwd() , dir || './');
    if (!fs.existsSync(cwdDir)) {
        log.warn(`Folder is not Exist : ${cwdDir}`);
        process.exit();
    }
    if (!dir && cmd.base) {
        // init --base
        setBaseProject(cwdDir);
    } else if (dir){
        // init ./  or init ./ --base
        if (existsDmrFile(cwdDir) && !cmd.force) {
            log.warn(`This is already a dmr project`);
            if (cmd.base) {
                // init ./ --base
                setBaseProject(cwdDir);
                return;
            }
            process.exit();
        } else {
            initDmrProject(cwdDir, function(){
                if (cmd.base) {
                    // init ./ --base
                    setBaseProject(cwdDir);
                }
            });
        }
    } else{
        log.warn('Missing Path or --base');
    }
};

function setBaseProject (dir) {
    let dmrPath = path.resolve(dir, './dmr.json');
    if (!existsDmrFile(dir)) {
        log.error(`This is not a dmr project : ${dir} \r\nYou can dmr init first`);
        process.exit(1);
    }
    let dmrJson = File.readJsonSync(dmrPath);
    console.log(`Are you sure to set Base Project Here ? \r\n${dir}`);
    let result = confirm().next(function(result){
        if (result) {
            let conf = dmrConfSyncToEnv(dmrJson, dmrPath)
            // conf增加项目信息
            conf["base-project"] = dmrJson["project-name"];
            console.log(`Successful Change Base Project to "${dmrJson["project-name"]}"`);
            ec.save(conf);
        }
    });
}

function existsDmrFile (dir){
    let dmr = path.resolve(dir, './dmr.json');
    return fs.existsSync(dmr);
}

function initDmrProject (dir, cb){
    var dirs = dir.split(/(\/|\\)/);
    let dmrPath = path.resolve(dir, './dmr.json');
    var projectName = dirs[dirs.length -1];
    var dmrJson = {};
    
    input(`Enter For Use Project Name "${projectName}" or Type New One :`).next(function (txt) {
        if(txt.length > 20 || txt.indexOf('/') > -1 || txt.indexOf('\\') > -1){
            console.log('Irregular Name , Try Again :');
            return false;
        } else {
            projectName = txt || projectName;
        }
        dmrJson["project-name"] = projectName;
        // dmr配置写入项目根目录
        File.writeJsonSync(dmrPath, dmrJson);
        console.log(`Successful Init "${dmrJson["project-name"]}"`);
        let conf = dmrConfSyncToEnv(dmrJson, dmrPath);
        ec.save(conf);
        cb();
    });
}

function dmrConfSyncToEnv (dmrJson, dmrPath) {
    let conf = Object.assign({}, enviromentConfig);
    conf[dmrJson["project-name"]] = {
        root: path.resolve(dmrPath, '..')
    };
    return  conf;
}

module.exports = {
    exec: exec
};