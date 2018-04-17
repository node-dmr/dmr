var Log = require('../packages/util/log');
var log = new Log(2);
Log.setGlobalLev(5);

var stream = require('stream');
var util = require('util');

var action = "{\"file\":\"D:\\\\work\\\\speedup\\\\ace\\\\rs0.log\",\"range\":{\"startTimeStamp\":1523952101118,\"endTimeStamp\":1523952102118},\"task-type\":\"import\",\"task-id\":\"search_ac\"}";

var TaskFactory = require('../packages/core/task-factory');
var Action = require('../packages/core/action');

var task = TaskFactory.create(Action.parse(action));

task.run();