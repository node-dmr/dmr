/*
 * @Author: qiansc 
 * @Date: 2018-05-06 22:16:22 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-14 19:33:22
 */
const fs = require('fs');
const path = require('path');
const File = require('../util/file');
const os = require("os");
const input = require('../cli/user-input').input;


let syspath;

if (os.type().toLowerCase().indexOf('windows') > -1) {
    syspath = path.resolve(os.tmpdir() , '../dmr/');
    //let path = 
} else {
    syspath = path.resolve(os.tmpdir() , './.dmr/');
}
let epath = path.resolve(syspath, './enviroment.json');
let edevpath ='../../config/enviroment.dev.json';

let configPath = path.resolve(__dirname , edevpath);
if (!fs.existsSync(configPath)) {
    configPath = epath;
}

if (!fs.existsSync(configPath)) {
    console.log(`Dmr will add Enviroment Config  at ${configPath}.`);
    File.mkdirsSync(syspath);
    File.writeJsonSync(configPath, {
        // you can create enviroment.dev.json and then develop with it
        "base-project": null
    });
}


module.exports = {
    get: function(){
        const config = File.readJsonSync(configPath);
        return config;
    },
    save: function(newEnv){
        File.writeJsonSync(configPath, newEnv);
    }

};