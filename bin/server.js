/*
 * @Author: qiansc 
 * @Date: 2018-04-27 17:00:04 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-27 17:07:07
 */
var path = require('path');
var program = require('commander');
var Log = require('../packages/util/log');
var Server = require('../packages/server/server-api');

var log = new Log(2);

program
.version('0.1.0', '-v, --version')
.option('-s, --server <value>', 'Server Name')
.option('-p, --project <value>', 'Specify Project');

program.on('--help', function(){
  log.info('');
  log.info('  Examples:');
  log.info('');
  log.info('    $ server -s api');
  log.info('');
  log.info('  Supported server:');
  log.info('');
  log.info('    api');
  log.info(' ');
});

program.parse(process.argv);

new Server().start();