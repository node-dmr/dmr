/*
 * @Author: qiansc 
 * @Date: 2018-06-26 19:48:12 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-27 11:16:38
 */
class Chain {
    constructor(dimParten, keys) {
        this.chain = {
            children: []
        };
        // let path = [];
        // let target;
        // keys.forEach((key, index) => {
        //     dimParten.forEach(dimp => {
        //         target = this.getTarget();
        //         let value = dimp[key];
        //     });
        //     path.push(key);
        // });
        dimParten.forEach(dimp => {
            this.getTarget(dimp, keys);
        });
    }
    getTarget(dimp, keys){
        let target =  this.chain;
        keys.forEach(key => {
            let index =  find(target.children, dimp[key]);
            if (index == -1){
                let tmp = {
                    name: dimp[key] === "*" ? "All" : dimp[key],
                    value: key + '=' + encodeURIComponent(dimp[key]),
                    key: key,
                    val: dimp[key],
                    children: []
                };
                target.children.push(tmp);
                target = tmp;
            } else {
                target = target.children[index];
            }
        });
    }
    get() {
        return this.chain.children;
    }
}

function find(children,value) {
    let rs = -1;
    children.forEach((child, index) => {
        if (child.val === value) {
            rs = index;
        }
    });
    return rs;
}

module.exports = Chain;