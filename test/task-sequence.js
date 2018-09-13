/*
 * @Author: qiansc
 * @Date: 2018-09-13 09:17:22
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-13 10:07:09
 */
const TaskInterface = require('../src/util/task');
const TaskSec = require('../src/task-sequence');
const Range = require('../src/util/range');
const expect = require('chai').expect;

describe("Task Sequence Test", () =>{
  let Task;
  it ('immplement TaskInterface', () => {
    class T extends TaskInterface {
      run(option) {
        Object.assign(this.option, option);
        console.log(this.option.info);
        if (this.option.range && this.option.range.duration().as('H') === 5) {
          return Promise.reject(['ERR TEST duration == 5',this.option, this.option]);
        }
        return Promise.resolve();
      }
    }
    Task = T;
    let task = new Task();
    task.run({info: 'Task Created Successfully'});
  })

  it("Task Sequence Minify", () => {
    let ts = new TaskSec();
    let range = new Range('now','PT24H');
    ts.setOption('info', 'Task in Sequence is running');
    return ts.run(range, Task);
  });

  it("Task Sequence 4 - 1:1", () => {
    let ts = new TaskSec({interval: 'PT1H'});
    let range = new Range('now','PT4H');
    ts.setOption('info', 'Task in Sequence4 1:1 is running');
    return ts.run(range, Task).then((sequence) => {
      return new Promise((resolve, reject) => {
        sequence.length == 4 ? resolve() : reject();
      });
    });
  });

  it("Task Sequence 4 - 2:1 will be error", () => {
    let ts = new TaskSec({interval: 'PT1H'});
    ts.setOutputInterval('PT1H');
    ts.setInputInterval('PT2H');
    let range = new Range('now','PT4H');
    ts.setOption('info', 'Task in Sequence4 2:1 is running');
    return ts.run(range, Task).then(() => {
      console.log('err has not been catched');
      return Promise.reject();
    }).catch(err => {
      console.log('err has been catched', err);
      return Promise.resolve();
    });
  });

  it("Task Sequence 4 - 1:2", () => {
    let ts = new TaskSec({'input-interval': 'PT1H', 'output-interval': 'PT2H'});
    let range = new Range('now','PT4H');
    ts.setOption('info', 'Task in Sequence4 1:2 is running');
    return ts.run(range, Task).then((sequence) => {
      return new Promise((resolve, reject) => {
        sequence.length == 2 ? resolve() : reject();
      });
    });
  });

  it("Task Sequence 10 - 1:5 test error task catch", () => {
    let ts = new TaskSec({'input-interval': 'PT1H', 'output-interval': 'PT5H'});
    ts.setInputInterval();
    ts.setOutputInterval();
    let range = new Range('now','PT10H');
    ts.setOption('info', 'Task in Sequence10 1:5 is running');
    return ts.run(range, Task).then((sequence) => {
      return Promise.reject();
    }).catch((err) =>{
        console.log('err task has been catched!');
    });
  });

  it("Task Sequence range error", () => {
    let ts = new TaskSec();
    return new Promise((resolve,reject) => {
      ts.run({}, Task).then((sequence) => {
        reject();
      }).catch((err) =>{
        console.log('err range has been catched!', err);
        resolve();
      });
    })
  });
});
