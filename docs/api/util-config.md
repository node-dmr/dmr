<a name="Config"></a>

## Config
**Kind**: global class  

* [Config](#Config)
    * [new Config(path)](#new_Config_new)
    * [.json()](#Config+json) ⇒ <code>JSON</code>

<a name="new_Config_new"></a>

### new Config(path)

| Param | Type |
| --- | --- |
| path | <code>pathLike</code> | 

**Example**  
```js
let conf;
conf = new Config('config/hello/import');
conf = new Config('hello/import');
console.log(conf.json());

let sourceConf = conf.load('source:http');
let pipeConf = conf.load('pipe:import');
```
<a name="Config+json"></a>

### config.json() ⇒ <code>JSON</code>
get config json
config will be load when called

**Kind**: instance method of [<code>Config</code>](#Config)  
**Returns**: <code>JSON</code> - config json  
