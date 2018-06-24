/*
 * @Author: qiansc 
 * @Date: 2018-06-19 20:34:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-22 00:14:25
 * 动态木桶流排序
 * 木桶排序改进算法 改进点主要在 动态根据数据 平衡精度及内存消耗
 */

 class Bucket {
     constructor (option) {
        this.bucket = new Array(10000);
        this.ext =  new Array();
        this.precision = 0.01;
        this.extPrecent = 0.01;
        this.NaNCount = 0;
        this._count = 0;
        this.multiple = 10;
     }
     add (val) {
         let value = parseFloat(val);
         if (!isNaN(value)) {
            let pos = Math.round(value / this.precision);

            if (pos > this.bucket.length) {
                if (this._checkExt()) {
                    // console.log('push ext', val, this.precision , pos , this.bucket.length);
                    this.ext.push(parseFloat(val));
                } else {
                    // console.log('_shuffle', val);
                    this._shuffle();
                    this.add(val);
                    return;
                }
            } else {
                // console.log('bucket', pos);
                this.bucket[pos] = (this.bucket[pos] || 0 ) + 1;
            }
         } else {
             this.NaNCount ++;
         }
     }
     _checkExt() {
         // console.log('check ext', this.ext.length , this.bucket.length * this.extPrecent);
         if (this.ext.length >= this.bucket.length * this.extPrecent) {
             return false;
         }
         return true;
     }
    /*
     *  洗牌 精度会*multiple 然后重新排布bucket
     */
     _shuffle() {
         // console.log('_shuffled', this.precision);
         this.precision = this.precision * this.multiple;
         // bucket 精度重置
         for(let i = 0; i < this.bucket.length; i+= this.multiple) {
            let count = 0;
            for (let j = i; j < i + this.multiple; j++) {
                count += this.bucket[j] || 0;
                this.bucket[j] = 0;
            }
            let pos = Math.round(i / this.multiple);
            this.bucket[pos] = count;
         }
        // ext 重算
        let ext = [];
        let max = this.bucket.length * this.precision;
        for (let i = 0; i < this.ext.length; i++) {
            if (this.ext[i] > max) {
                ext.push(this.ext[i]);
            } else {
                let pos = Math.round(this.ext[i] / this.precision);
                this.bucket[pos] = (this.bucket[pos] || 0) + 1; 
            }
        }
        this.ext = ext;
     }

     reduce() {
        this.ext = this.ext.sort(function(x, y){
            return x >  y? 1:-1;
        });
     }
     count() {
         if (this._count) return this._count;
         let count = this.ext.length;
         this.bucket.forEach((num, index) => {
            count += num || 0;
         });
         this._count = count || this.NaNCount;
         return this._count;

     }
     avg() {
        let count = this.count();
        let sum = 0, sumExt = 0;
        this.bucket.forEach((num, index) => {
           sum += (num || 0) * index;
        });
        this.ext.forEach(num => {
            sumExt += num;
        });
        return Math.round((sum * this.precision + sumExt) * 100 / count ) / 100;
     }
     pos(p) {
         let count = this.count();
         let prev = Math.round((100 - p) * count / 100);
         if (prev <= this.ext.length) {
            return this.ext[this.ext.length - prev];
         } else {
            let cur = this.ext.length;
            for (let i = this.bucket.length -1 ; i >=0; i--) {
                cur += this.bucket[i] || 0;
                if (cur >= prev) {
                    return i * this.precision;
                }
            }
         }
         return;
     }
     
 }

 module.exports = Bucket;