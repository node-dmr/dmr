/*
 * @Author: qiansc 
 * @Date: 2018-05-06 19:59:02 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-10 22:09:20
 */
let dmr = {};
let cli = {
    init: require('./cli/init')
};

dmr.cli = cli;
dmr.schedule = require('./schedule/main.js')
module.exports = dmr;