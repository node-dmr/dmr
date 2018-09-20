<a name="Range"></a>

## Range
**Kind**: global class  

* [Range](#Range)
    * [new Range([start], [duration], [end])](#new_Range_new)
    * [.set([start], [end])](#Range+set)
    * [.start([start])](#Range+start) ⇒ <code>Moment</code>
    * [.end([end])](#Range+end) ⇒ <code>Moment</code>
    * [.duration([duration], [start])](#Range+duration) ⇒ <code>Duration</code>
    * [.toString([Mformat], [separater], [Dformat])](#Range+toString)
    * [.isValid()](#Range+isValid) ⇒ <code>Boolean</code>
    * [.split(duration, remainder)](#Range+split) ⇒ <code>Array</code>

<a name="new_Range_new"></a>

### new Range([start], [duration], [end])
Time Range
Moment Prase API http://momentjs.com/docs/#/parsing/ ,
Moment Prase Extra Support [++/--duration] and [now] such as :
moment++duration , now--duration .
Duration Create API http://momentjs.com/docs/#/durations/


| Param | Type | Description |
| --- | --- | --- |
| [start] | <code>Moment</code> \| <code>Date</code> | Start Moment |
| [duration] | <code>Duration</code> | End Moment or Duration |
| [end] | <code>Moment</code> \| <code>Date</code> | End Moment or Duration |

**Example**  
```js
new Range('2018-09-01 12:00:00', '25:00:00');
new Range('20180901T12', 'PT25H');
new Range('20180901', 'P1DT1H');
new Range('20180901', null, Moment('20180902'));
new Range('now--60000', null, 'now');
new Range(new Date().getTime() - 60000, null, new Date());
```
<a name="Range+set"></a>

### range.set([start], [end])
set start / end ( Date | Timestamp) for range

**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Description |
| --- | --- | --- |
| [start] | <code>Moment</code> \| <code>Date</code> | Start Moment |
| [end] | <code>Moment</code> \| <code>Date</code> \| <code>Duration</code> | End Moment or Duration |

<a name="Range+start"></a>

### range.start([start]) ⇒ <code>Moment</code>
set start Moment for range, Moment API http://momentjs.com/docs/

**Kind**: instance method of [<code>Range</code>](#Range)  
**Returns**: <code>Moment</code> - start Moment  

| Param | Type | Description |
| --- | --- | --- |
| [start] | <code>Moment</code> \| <code>Date</code> | Start Moment |

<a name="Range+end"></a>

### range.end([end]) ⇒ <code>Moment</code>
set end Moment for range

**Kind**: instance method of [<code>Range</code>](#Range)  
**Returns**: <code>Moment</code> - end Moment  

| Param | Type | Description |
| --- | --- | --- |
| [end] | <code>Moment</code> \| <code>Date</code> | end Moment |

<a name="Range+duration"></a>

### range.duration([duration], [start]) ⇒ <code>Duration</code>
duration for range, Duration API http://momentjs.com/docs/#/durations/

**Kind**: instance method of [<code>Range</code>](#Range)  
**Returns**: <code>Duration</code> - durations  

| Param | Type | Description |
| --- | --- | --- |
| [duration] | <code>Duration</code> | duration |
| [start] | <code>Date</code> \| <code>Timestamp</code> |  |

**Example**  
```js
console.log(new Range().duration(1000, new Date()).as('s')); // 1
```
<a name="Range+toString"></a>

### range.toString([Mformat], [separater], [Dformat])
**Kind**: instance method of [<code>Range</code>](#Range)  

| Param | Type | Description |
| --- | --- | --- |
| [Mformat] | <code>string</code> | format of moment |
| [separater] | <code>string</code> | separater bwtween moment and durations |
| [Dformat] | <code>string</code> | format of duration |

<a name="Range+isValid"></a>

### range.isValid() ⇒ <code>Boolean</code>
isValid

**Kind**: instance method of [<code>Range</code>](#Range)  
<a name="Range+split"></a>

### range.split(duration, remainder) ⇒ <code>Array</code>
split current range by duration

**Kind**: instance method of [<code>Range</code>](#Range)  
**Returns**: <code>Array</code> - Array of ranges  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>Duration</code> |  |
| remainder | <code>Boolean</code> | keep the last range when range will be divided with remainder; |

