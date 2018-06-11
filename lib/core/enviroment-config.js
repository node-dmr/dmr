/*
 * @Author: qiansc 
 * @Date: 2018-05-06 22:16:22 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 15:38:17
 */
var fs = require('fs');
var path = require('path');
var File = require('../util/file');
let epath ='../../config/enviroment.json';
let edevpath ='../../config/enviroment.dev.json';

let configPath = path.resolve(__dirname , edevpath);
if (!fs.existsSync(configPath)) {
    configPath = path.resolve(__dirname , epath);
}
if (!fs.existsSync(configPath)) {
    // console.error();
    // process.exit(1);
    throw new Error('Enviroment Config is Missing : ' + configPath);
    // process.exit(1);
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