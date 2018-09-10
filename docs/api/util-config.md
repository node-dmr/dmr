<a name="Config"></a>

## Config
**Kind**: global class  

* [Config](#Config)
    * [new Config(path, scope)](#new_Config_new)
    * [.json()](#Config+json) ⇒ <code>JSON</code>
    * [.stringify(indent)](#Config+stringify) ⇒ <code>String</code>

<a name="new_Config_new"></a>

### new Config(path, scope)

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Path</code> |  |
| scope | <code>Object</code> | for config cache |

**Example**  
```js
let conf;
conf = new Config('hello/import');
console.log(conf.json());
```
<a name="Config+json"></a>

### config.json() ⇒ <code>JSON</code>
get config json
config will be load when called

**Kind**: instance method of [<code>Config</code>](#Config)  
**Returns**: <code>JSON</code> - config json  
<a name="Config+stringify"></a>

### config.stringify(indent) ⇒ <code>String</code>
stringify config

**Kind**: instance method of [<code>Config</code>](#Config)  

| Param | Type | Description |
| --- | --- | --- |
| indent | <code>indent</code> | format string |

