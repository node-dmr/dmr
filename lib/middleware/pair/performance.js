/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-07 20:19:40
 */
const Pair = require('./pair');
const ResultFactory = require('../../entity/resultFactory');

class Performance extends Pair {
    constructor (config) {
        super(config);
        // if (config.result) {
        //     this.rf = new ResultFactory(config.result);
        // }
        this.resultConfig = [];
        (config.result || []).forEach(item => {
            if (Array.isArray(item)) {
                this.resultConfig.push(item);
            } else if(typeof item == "string") {
                def.forEach(d => {
                    if (d[0] === item) {
                        this.resultConfig.push([
                            d[0], 'sub>>', d[1] 
                        ]);
                    }
                });
            }
        });
        this.rf = new ResultFactory(this.resultConfig);
    }
    deal (part) {
        try{
            var timing = JSON.parse(part);
            if(timing.responseEnd === undefined){
                timing = false;
            }
        } catch (e) {
            timing = false;
        }
        if (timing === false){
            return false;
        }
        let result = this.rf.parse(timing);
        console.log(result);
        return result;
    }
}

module.exports = Performance;


time = function(end, start) {
    return this[end] - this[start];
};
const def = [
    [ 'lookup'        , ['$requestStart', '$navigationStart']                 ],
    [ 'waiting'       , ['$responseStart', '$requestStart']                   ],
    [ 'request'       , ['$responseEnd', '$requestStart']                     ],
    [ 'receiving'     , ['$responseEnd', '$responseStart']                    ],
    [ 'init'          , ['$domInteractive', '$responseEnd']                   ],
    [ 'parsing'       , ['$domComplete', '$domLoading']                       ],
    [ 'content'       , ['$domContentLoadedEventStart', '$navigationStart']   ],
    [ 'load'          , ['$loadEventStart', '$navigationStart']               ],
    [ 'fetch'         , ['$fetchStart', '$navigationStart']                   ],
    [ 'loadend'       , ['$loadEventEnd', '$navigationStart']                 ],
    [ 'redirect'      , ['$redirectEnd', '$redirectStart']                    ],
    [ 'appcache'      , ['$domainLookupStart', '$fetchStart']                 ],
    [ 'connect'       , ['$connectEnd', '$connectStart']                      ],
    [ 'domReady'      , ['$domComplete', '$domInteractive']                   ],
    [ 'loadEvent'     , ['$loadEventEnd', '$loadEventStart']                  ]
];
