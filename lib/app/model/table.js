/*
 * @Author: qiansc 
 * @Date: 2018-06-29 00:03:34 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-29 01:32:27
 */
const DimFilterTransform = require('../../pipeline/transform-filter-dim');
const Dim = require('../../entity/dim');

class Table {
    constructor(config) {
        // {"row": "field","columns": ["calculate", "value"]}
        this.config = normalize(config);
        this.dims = [];
    }
    readReport(option) {
        option = option || {};
        let alias = option.alias || {'value': 'value'};

        let config =  this.config;
        let reader = option.stream;
        let dimParten = Object.assign({}, config.dimParten);
        dimParten[config.row] = '*';
        config.columns.forEach(column => {
            dimParten[column.id] = '*';
        });
        Object.keys(alias).forEach(al => {
            dimParten[al] = '**';
        });
        reader.on('data', result => {
            let dim = new Dim(result.get('key'));
            dim.set('calculate', result.get('calculate'));
            dim.set('value', result.get('value'));
            let newDimParten = dim.match(dimParten);
            if (newDimParten) {
                this.add(dim, newDimParten, alias);
            }
        });
    }
    add(dim, newDimParten, alias) {
        newDimParten = JSON.stringify(newDimParten);
        dim.parten = newDimParten;
        this.dims.forEach(d => {
            if (dim && d.parten === newDimParten) {
                Object.keys(alias).forEach(al => {
                    d.set(alias[al], dim.get(al));
                });
                dim = null;
            }
        });
        if (dim !== null) {
            Object.keys(alias).forEach(al => {
                dim.set(alias[al], dim.get(al));
                if (al !== alias[al]) {
                    dim.del(al);
                };
            });
            this.dims.push(dim);
        }
        // this.dims = dim;
    }
}

function normalize(config) {
    config = config || {};
    config.columns = config.columns || [];
    config.columns.forEach((element, index)=> {
        if (typeof element === 'string') {
            config.columns[index] = {
                "name": element,
                "id": element
            }
        };
    });
    return config;
}
module.exports = Table;