var Client = require('ftp');
var fs = require('fs');



function download () {
    var c = new Client();
//        c.on('ready', function() {
            // c.get('foo.txt', function(err, stream) {
            //     if (err) throw err;
            //     stream.once('close', function() { c.end(); });
            //     stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
            // });
    });
    // connect to localhost:21 as anonymous
    //c.connect();
}

module.exports = {

};