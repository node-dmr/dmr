var Log = require('../packages/util/log');
var log = new Log(2);
Log.setGlobalLev(9);

var stream = require('stream');
var util = require('util');
class Duplexer extends stream.Duplex{
    constructor (option) {
        super();
        //this.data = [];
    }
    _read (size) {
        // var chunk = this.data.shift();
        // console.log("_read",chunk && chunk.toString());
        // if(chunk){
        //     //this.push(chunk);
        // }else{
        // }
    };
    _write (data, encoding, callback) {
        console.log("_write",data.toString());
        //this.data.push(data);
        this.push(data);
        callback();
    };
}

var d = new Duplexer({allowHalfOpen:true});
//d.pipe(process.stdout);
d.on('end', function(){
  console.log('Message Complete');
});
d.write("11111111");
d.write("222222222");
d.write("33333333333");
d.on('data', function(chunk){
    console.log('DATA',chunk.toString());
  });
  d.write('444444');
setTimeout(function(){
    d.write('55555555');
    d.write('66666666');
},100);