/*
 * @Author: qiansc 
 * @Date: 2018-05-18 00:15:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-19 23:49:39
 */
const Middleware = require('../middleware');

class Divider extends Middleware {
    constructor (config) {
        super(config);
        this.handler = [];
        this.parseNextHandler(config);
    }
    split () {
        console.error("split method needs to be implemented!");
    }
    parseNextHandler (config) {
        Object.keys(this.config).forEach(key => {
            let matches = key.match(/^(next[s]*)(\-\$\S+)/);
            if (matches){
                // "next-$1-$2-$3"
                // "nexts-$1-$2"
                let targets = matches[2].split('\-\$');
                targets.forEach(target => {
                    target =  parseInt(target);
                    if (!isNaN(target) && matches[1] === "next" && !Array.isArray(this.config[key])) {
                        let handler = new NextHandler(this.config[key], target);
                        this.handler.push(handler);
                    } else if (!isNaN(target) && matches[1] === "nexts" && Array.isArray(this.config[key])) {
                        this.config[key].forEach(config => {
                            let handler = new NextHandler(config, target);
                            this.handler.push(handler);
                        });
                    }
                });
            } else if (key === 'next-each') {
                let handler = new NextHandler(this.config[key]);
                this.handler.push(handler);
            } else if(key === 'nexts' && Array.isArray(this.config[key])) {
                let arr = this.config[key];
                arr.forEach((config, index) => {
                    if (config) {
                        let handler = new NextHandler(config, index);
                        this.handler.push(handler);
                    }
                });
            }
        });
    }
    handle (entire, together){
        let parts = this.deal(entire);
        this.handler.forEach(handler => {
            handler.handle(parts, together);
        });
    }
}

class NextHandler {
    constructor (config, target) {
        this.target = target || false;
        let MiddleWareFactory =  require('../factory');
        this.middleware = MiddleWareFactory.create(config);
    }
    handle (parts, together){
        if (this.target && parts[this.target]) {
            this.middleware.handle(parts[this.target], together);
        }
        if (!this.target) {
            parts.forEach(part => {
                this.middleware.handle(part, together);
            });
        }
        
    }
}

module.exports = Divider;