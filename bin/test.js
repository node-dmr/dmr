var Log = require('../packages/util/log');
var log = new Log(2);
Log.setGlobalLev(9);
var Config = require('../packages/core/config.js');

var fs  = require('fs');

var ws = fs.createWriteStream("hello3.txt");
ws.write("O(∩_∩)O哈哈~");
ws.write("O(∩_∩)O~");

//关闭流
ws.end();