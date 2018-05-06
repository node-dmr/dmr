/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 20:38:10
 */
var Middleware = require('../middleware/middleware');

class PerformanceMiddleWare extends Middleware{
    constructor (config) {
        super(config);
        var columns = config.columns || [];
        columns.forEach(item => {
            if (Array.isArray(item)) {
                table.push(item);
            } else if(typeof item == "string") {
                def.forEach(d => {
                    if (d[0] === item) {
                        table.push(d);
                    }
                });
            }
        });
    }
    handle (string, next) {
        try{
            var timing = JSON.parse(string);
            if(timing.responseEnd === undefined){
                timing = false;
            }
        } catch (e) {
            timing = false;
        }
        if (timing === false){
            return next(false);
        }
        var result = caculate(timing, this.config);
        return next(result);
    }
}

module.exports = PerformanceMiddleWare;

time = function(end, start) {
    return this[end] - this[start];
};
var def = [
    [ 'lookup'        , ['requestStart', 'navigationStart']                 ],
    [ 'waiting'       , ['responseStart', 'requestStart']                   ],
    [ 'request'       , ['responseEnd', 'requestStart']                     ],
    [ 'receiving'     , ['responseEnd', 'responseStart']                    ],
    [ 'init'          , ['domInteractive', 'responseEnd']                   ],
    [ 'parsing'       , ['domComplete', 'domLoading']                       ],
    [ 'content'       , ['domContentLoadedEventStart', 'navigationStart']   ],
    [ 'load'          , ['loadEventStart', 'navigationStart']               ],
    [ 'fetch'         , ['fetchStart', 'navigationStart']                   ],
    [ 'loadend'       , ['loadEventEnd', 'navigationStart']                 ],
    [ 'redirect'      , ['redirectEnd', 'redirectStart']                    ],
    [ 'appcache'      , ['domainLookupStart', 'fetchStart']                 ],
    [ 'connect'       , ['connectEnd', 'connectStart']                      ],
    [ 'domReady'      , ['domComplete', 'domInteractive']                   ],
    [ 'loadEvent'     , ['loadEventEnd', 'loadEventStart']                  ]
];
var table = [];
function caculate (timing, config) {
    var detail = {};
    table.forEach(function(item) {
        var rs = time.apply(timing, item[1]);
        if (rs >0 && rs < 100000){
            detail[item[0]] = rs;
        }
    });
    return detail;
} 