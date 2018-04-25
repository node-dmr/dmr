var Log = require('../packages/util/log');
var log = new Log(2);
Log.setGlobalLev(5);

var stream = require('stream');
var util = require('util');

var schedule = require('node-schedule');
 
var j = schedule.scheduleJob('45 * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});