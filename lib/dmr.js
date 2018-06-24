/*
 * @Author: qiansc 
 * @Date: 2018-05-06 19:59:02 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-11 00:23:09
 */
let dmr = {};
let cli = {
    init: require('./cli/init')
};

dmr.cli = cli;
dmr.schedule = require('./schedule/main.js');
dmr.runner = require('./task/runner');

module.exports = dmr;