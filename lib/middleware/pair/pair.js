/*
 * @Author: qiansc 
 * @Date: 2018-05-18 11:04:29 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-15 12:08:49
 */
const Middleware = require('../middleware');
const MiddleWareFactory =  require('../factory');

class Pair extends Middleware {
    constructor (config) {
        config = normalize(config);
        super(config);
    }
    _handle (part, togather) {
        if (this.deal  === undefined) {
            console.error("handle or pick method needs to be implemented!");
        } else {
            let result = this.deal(part);
            if (this.config['allow-keys']) {
                result.keys().forEach(key => {
                    if (this.config['allow-keys'].indexOf(key) === -1) {
                        result.predel(key);
                    }
                });
                result.del();
            }
            if (this.config['prefix']) {
                result.forEach(item => {
                    item[0] = this.config['prefix'] + item[0];
                });
            }
            togather(result);
        }
    }
}
function normalize(config) {
    if (config['allow-keys'] && typeof config['allow-keys'] === "string") {
        config['allow-keys'] = config['allow-keys'].split('|');
    }
    return config;
}
module.exports = Pair;