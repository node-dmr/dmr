/*
 * @Author: qiansc 
 * @Date: 2018-06-26 19:48:12 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-28 23:10:01
 */
const DimChained = require('../model-provider/dim-chained');

let Provider = {
    produce : function(dims, keys) {
        // change dims [ { idc: 'all', format: 'all' } , ...] to chained
        let chaineds = {
            children: []
        };
        dims.forEach(dimp => {
            let target =  chaineds;
            keys.forEach(key => {
                let index =  find(target.children, dimp[key]);
                if (index == -1){
                    let tmp = {
                        name: dimp[key] === "_all" ? "All" : dimp[key],
                        value: DimChained.produceItem(key,dimp[key]),
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
        });
        return chaineds.children;
    }
};


function find(children,value) {
    let rs = -1;
    children.forEach((child, index) => {
        if (child.val === value) {
            rs = index;
        }
    });
    return rs;
}


module.exports = Provider;