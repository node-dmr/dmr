var Log = require('../packages/util/log');
var log = new Log(2);
Log.setGlobalLev(5);

var stream = require('stream');
var util = require('util');
var later = require('later');
// var action = "{\"file\":\"D:\\\\work\\\\speedup\\\\ace\\\\rs0.log\",\"range\":{\"startTimeStamp\":1523952101118,\"endTimeStamp\":1523952102118},\"task-type\":\"import\",\"task-id\":\"search_ac\"}";

// var TaskFactory = require('../packages/core/task-factory');
// var Action = require('../packages/core/action');

// var task = TaskFactory.create(Action.parse(action));

// task.run();
// var b = new Buffer('1234567');
// var pos = b.indexOf('3');
// var c =  b.slice(0, pos);
// var d =  b.slice(pos+1);
// console.log(c.toString(),d.toString(),b.toString());

later.date.localTime();
  // will fire every 5 minutes
  // var textSched1 = later.parse.text('every 5 second');
  // var textSched2 = later.parse.text('every 3 second');
  // // execute logTime one time on the next occurrence of the text schedule
  // //var timer = later.setTimeout(logTime, textSched);

  // var timer1 = later.setInterval(function(){
  //   console.log(1, new Date());
  // }, textSched1);

  // var timer2 = later.setInterval(function(){
  //   console.log(2, new Date());
  // }, textSched2);
 
  var Client = require('ftp');
  var fs = require('fs');

  var c = new Client();
  c.on('ready', function() {
    c.get('/home/work/speedup_use/20180424/01.gz', function(err, stream) {
      if (err) throw err;
      stream.once('close', function() { c.end(); });
      stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
    });
  });
  // connect to localhost:21 as anonymous
  c.connect({
    host:"hz01-mms-vgbi08.hz01.baidu.com"
  });