<a name="TaskSequence"></a>

## TaskSequence
**Kind**: global class  

* [TaskSequence](#TaskSequence)
    * [new TaskSequence(config)](#new_TaskSequence_new)
    * [.setInputInterval(duration)](#TaskSequence+setInputInterval)
    * [.setOutputInterval(duration)](#TaskSequence+setOutputInterval)
    * [.setOption(key, value)](#TaskSequence+setOption)
    * [.run(range, [Task])](#TaskSequence+run) ⇒ <code>Promise</code>

<a name="new_TaskSequence_new"></a>

### new TaskSequence(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> |  |
| [interval.interval] | <code>Duration</code> \| <code>String</code> | interval of input & output |
| [interval.input-interval] | <code>Duration</code> \| <code>String</code> | interval of input |
| [interval.output-interval] | <code>Duration</code> \| <code>String</code> | interval of output |

<a name="TaskSequence+setInputInterval"></a>

### taskSequence.setInputInterval(duration)
**Kind**: instance method of [<code>TaskSequence</code>](#TaskSequence)  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>Duration</code> \| <code>String</code> | override input-interval |

<a name="TaskSequence+setOutputInterval"></a>

### taskSequence.setOutputInterval(duration)
**Kind**: instance method of [<code>TaskSequence</code>](#TaskSequence)  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>Duration</code> \| <code>String</code> | override output-interval |

<a name="TaskSequence+setOption"></a>

### taskSequence.setOption(key, value)
Set option of task

**Kind**: instance method of [<code>TaskSequence</code>](#TaskSequence)  

| Param | Type |
| --- | --- |
| key | <code>String</code> | 
| value | <code>Object</code> | 

<a name="TaskSequence+run"></a>

### taskSequence.run(range, [Task]) ⇒ <code>Promise</code>
Run Task

**Kind**: instance method of [<code>TaskSequence</code>](#TaskSequence)  

| Param | Type | Default |
| --- | --- | --- |
| range | <code>Range</code> |  | 
| [Task] | <code>Task</code> | <code>IOTask</code> | 

