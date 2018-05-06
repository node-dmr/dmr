/*
 * @Author: qiansc 
 * @Date: 2018-05-06 22:16:22 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-07 00:53:17
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
const config = File.readJsonSync(configPath);



module.exports = {
    config: config,
    save: function(newEnv){
        File.writeJsonSync(configPath, newEnv);
    }

};