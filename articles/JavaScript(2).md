---
title: JavaScript笔记（2）
category: JavaScript
date: 2022-1-10
---

### 第五章 基本引用类型

#### 1.Date

> 此处只介绍Date类型常见的一些API，以及一些容易犯错的地方

**getTime()**:返回日期的毫秒表示

```
let date = new Date();
console.log(date.getTime());   //1641859833554
```

**getFullYear()**:返回4位数年

```
console.log(date.getFullYear());  //2022
```

**getMonth()**:返回日期的月

```
console.log(date.getMonth())    //0
```

**此处getMonth返回的月是从0开始的（即代表一月）**

**getDate()**:返回日期的日

```
console.log(date.getDate());    //11
```

**getDay()**:返回日期中表示星期几的数值

> 此处的数值，0表示周日，6表示周六，国外都把周日当作一周的第一天

后面的getHours()，getMinutes()，getSeconds()就不一一介绍了



#### 2.RegExp

> 创建正则表达式：

**let re = /pattern/flags;**

> 这个正则表达式的pattern可以是任何简单或复杂的正则表达式；每个正则表达式可以带0个或者多个flags，用于控制正则表达式的行为。

**let re = new RegExp("pattern","flags")**



下面是flags的取值以及作用

> g：全局模式，表示查找字符串的全部内容，而不是找到第一个匹配的内容就结束
>
> i：不区分大小写
>
> m：多行模式，表示查找到一行文本末尾时会继续查找

**与其他语言中的正则表达式类似，所有元字符在模式中也必须转义，包括：**

（ ）{ } [ ] \ ^ $ |? * + .



**RegExp实例方法**

**exec：**一个在字符串中执行查找匹配的RegExp方法，它返回一个数组（未匹配到则返回 null）

```
var myRe = /db+d/g;
var myArray = myRe.exec("cdbbd dbbdz");   //[ 'dbbd', index: 1, input: 'cdbbd dbbdz', groups: undefined ]
```

**test：**一个在字符串中测试是否匹配的RegExp方法，它返回 true 或 false

**match：**一个在字符串中执行查找匹配的String方法，它返回一个数组，在未匹配到时会返回 null	

```
var myRe = /db+d/g;
var test = "cdbbddbdz".match(myRe);   //[ 'dbbd', 'dbd' ]
```

**replace：**一个在字符串中执行查找匹配的String方法，并且使用替换字符串替换掉匹配到的子字符串

> 正则表达式要是真要很熟练还是挺难的，平时只要能看懂我觉得就差不多了，要用到的时候再去查一下



#### 3.原始值包装类型

> 为了方便操作原始值，ECMAScript提供了三种特殊的引用类型：Boolean，Number和String

````
let s1 = "some text";
let s2 = s1.substring(2);
````

> 在这里，s1是一个包含字符串的变量，并且是一个原始值。第二行紧接着在s1上调用了substring()方法，我们知道，原始值并不是对象，因此逻辑上不应该有方法，而实际上这个例子却按照预期执行了，这是因为后台进行了处理

后台会执行以下三步：

```
let s1= new String("some text");	//创建一个String类型实例
let s2 = s1.substring(2);		    //调用实例上的方法
s1 = null;						   //销毁实例
```

这种行为让原始值拥有对象的行为。

```
let value = "123";
let number = Number(value);
console.log(typeof number);	  //number
let obj = new Number(value);
console.log(typeof obj);      //object
注意区分构造函数和转型函数的调用
```



> 下面是一些经常犯错的点，虽然可能和本章没什么关系，但是，在总结时想到了这类问题

```
1toString()    //报错，语法错误
1.toString()   //报错，JS引擎无法确定这里的`.`是什么意思，是点运算符（对象方法）还是浮点数？
1..toString()    //成功，运算结果"1" 解析: 第二个点被视为点运算符，前面的是浮点数。
1.0.toString()   //成功，运算结果"1" 解析: 第二个点被视为点运算符，前面的是浮点数。
1 .toString()    //成功，运算结果"1" 解析: 用空格和后面的.toString()隔开, 把前面的当成运算式处理
1+2.toString() //报错，JS引擎无法确定这里的`.`是什么意思，是点运算符（对象方法）还是浮点数？
1+2 .toString() //成功，运算结果"12" 解析: 用空格和后面的.toString()隔开, 把前面的当成运算式处理
(1+2).toString() //成功，运算结果"3" 解析: 括号内部的先进行算法运算，在进行类型转换
(1)+(2).toString() //运算结果"12" 解析: 括号内部进行类型修改并将数字n转换为字符串“n “，在进行拼接，然后再应用toString方法。
(1)+(2)+0 .toString() //成功，运算结果"30" 解析: 如果有多个`+`号，且不包含中括号与""的情况下，则把最后一个加号之前的进行数学运算(不管他有没有被括号包住)，最后一个加号留作拼接作用。
```


##### 3.1Boolean

```
let falseObject = new Boolean(false);
let result = falseObject && true;
console.log(result);    //true;

在这段代码中，我们创建了一个值为false的Boolean对象，在布尔运算中，false && true 应该为false，但是这里，falseObject并不是false，它是一个对象，前面一个章节讲过，在进行布尔运算时，所有的对象都会转换为true，因此此处为 true && true

let falseValue = false;
console.log(typeof falseObject);  //object
console.log(typeof falseValue);   //boolean
console.log(falseObject instanceof Boolean);  //true
console.log(falseValue instanceof Boolean);   //false;
```



##### 3.2Number

**toString()**:可选地接收一个表示基数的参数，并返回相应基数形式的数值字符串

```
let num = 10;
console.log(num.toString());      //"10"
console.log(num.toString(2));     //"1010"
console.log(num.toString(8));     //"12"
console.log(num.toString(16));    //"a"
```

**toFixed():**返回包含指定小数点的数值字符串

```
let num = 10;
console.log(num.toFixed(2));  //"10.00"
```

**isInteger():**ES6新增了Number.isInteger()方法，用于辨别一个数值是否是整数

```
console.log(Number.isInteger(1));    //true
console.log(Number.isInteger(1.00)); //true
console.log(Number.isInteger(1.01)); //false

当然也可以使用其他方法判断一个数值是否是整数
console.log(number % 1 === 0);  //为true则为整数，否则不为整数
```

> 整数的范围：Number.MIN_SAFE_INTEGER(-2的53次方+1) 到Number.MAX_SAFE_INTEGER(2的53次方-1)



##### 3.3String

**slice，substring 和 substr 的区别：**

> 当参数都是正数时

```
let str = "hello world";
console.log(str.slice(3));         //"lo world"
console.log(str.substring(3));     //"lo world"
console.log(str.substr(3));        //"lo world"
console.log(str.slice(3, 7));      //"lo w"
console.log(str.substring(3, 7));  //"lo w"
console.log(str.substr(3, 7));     //"lo worl",此处的7代表的是截取的长度
```

> 当参数中有负数时

```
let str = "hello world";
console.log(str.slice(-3));        //"rld"，截取开始位置=length+负数
console.log(str.substring(-3));    //"hello world"，只要碰到负数，就转换为0
console.log(str.slice(-3));        //"rld"，截取开始位置=length+负数
console.log(str.substring(3, -4)); //"lo w"，只要碰到负数，就转换为length+负数
console.log(str.substr(3, -4));    //""，空字符串，截取长度不能为负数
```

> ES6新增方法：startsWith()  endsWith()  includes()
>
> startsWith()和includes()接收两个参数，第一个表示搜索的字符串，第二个表示开始搜索的位置，默认为0
>
> endsWith()也接收两个参数，第一个表示搜索的字符串，第二个表示搜索的末尾位置



#### 4.单例内置对象

> 这里有Global和Math，这两个平时用的也比较多，这里就不详细介绍了，稍微总结Math的舍入方法

**Math.ceil():**始终向上舍入为最接近的整数

**Math.floor():**始终向下舍入为最接近的整数

**Math.round():**执行四舍五入

```
console.log(Math.ceil(26.1));       //27
console.log(Math.ceil(-26.1));      //-26
console.log(Math.floor(26.9));      //26
console.log(Math.floor(-26.1));     //-27
console.log(Math.round(26.4));      //26
console.log(Math.round(-26.4));     //-26
```



### 第六章 集合引用类型

#### 1.Object（对象）

> 显式地创建Object实例有两种方式

第一种是使用new操作符和Object构造函数创建

```
let person = new Object();
person.name = "chj";
person.age = 21;
```

第二种是使用**对象字面量**表示法

```
let person = {
    name: "chj",
    age: 21
};
```

> 在对象字面量表示法中，属性名可以是字符串或者数值，如果是数值，会自动转换为字符串
>
> Object类型是无序的，因此不可迭代



#### 2.Array

> 两个ES6新增的用于创建数组的静态方法：Array.from()和Array.of()

**Array.from():**第一个参数为**类数组对象**，即任何可迭代的结构，或者有一个length属性和可索引的元素的结构

```
console.log(Array.from("Matt));	   //["M", "a", "t", "t"]
```

```
const m = new Map().set(1, 2)
			      .set(3, 4);
console.log(Array.from(m));     //[[1, 2], [3, 4]]
```

```
//Array.from()对现有数组进行浅复制
const a1 = [1, 2, 3, 4];
const a2 = Array.from(a1);
console.log(a2);      //[1, 2, 3, 4]
console.log(a1 === a2)  //false
```



> 数组的length并不是只读的，可以通过修改length的值对数组进行操作



**检测数组：**

> 使用instanceof会存在问题，如果网页里面有多个框架，则可能涉及两个不同的全局执行上下文，因此会有两个不同版本的Array构造函数，为了解决这个问题，这里有个更好的方法用来判断数组：Array.isArray()



**迭代器方法：**

> 在ES6中，Array的原型上暴露了3个用于检索数组内容的方法：keys()  values()  和  entries()

```
const a = ["a", "b", "c", "d"];

//因为这些方法返回的都是迭代器，所以需要将他们通过Array.from()转换为数组
const aKeys = Array.from(a.keys());
const aValues = Array.from(a.values());
const aEntries = Array.from(a.entries());

console.log(aKeys);			//[0, 1, 2, 3]
console.log(aValues);		//["a", "b", "c", "d"]
console.log(aEntries);		//[[0,"a"], [1,"b"], [2,"c"], [3,"d"]]

//可以使用ES6的解构在循环中，拆分aEntries的键值对
for(let [index, value] of a.Entries()){//....};
```



> 填充方法：fill()
>
> 栈方法：push()  pop()
>
> 队列方法：unshift()  shift()  push()
>
> 排序方法：sort()  reverse()    都会改变原数组



**迭代方法：**（都不会改变原数组，进行操作之后，返回新数组）

> **every():**对数组每一项都运行传入的函数，如果每一项都返回true，则这个方法返回为true
>
> **some():**对数组每一项都运行传入的函数，如果有一项返回为true，则这个方法返回为true
>
> **filter():**对数组每一项都运行传入的函数，函数返回为true的项会组成新数组进行返回
>
> **forEach():**对数组每一项都运行传入的函数，没有返回值，且不可停止遍历
>
> **map():**对数组每一项都运行传入的函数，返回由每次函数调用的返回结果组成的新数组



#### 3.Map

> ECMAScript6之前，在JavaScript中实现键值对形式存储可以使用Object来完成，作为ES6的新增特性，Map是一种新的集合类型，为这门语言带来了真正的键值对存储机制，Map的大多数特性都可以通过Object类型实现，但二者还是存在一些细微的差异。

使用new关键字和Map构造函数创建一个空映射

```
const map = new Map()
```

可以在初始化时传入一个可迭代对象，可迭代对象的每个键值对都会按照迭代顺序插入新的映射实例（即新的Map对象）中

```
const m1 = new Map([
    ["key1", "val1"],
    ["key2", "val2"],
    ["key3", ""val3"]
]);
alert(m1.size);       //3，size为映射实例对象的属性，获取键值对的个数
```

**实例对象的方法**

```
let map = new Map();
map.set(key, value);	//插入键值对
map.get(key);			//获取对应键的映射
map.has(key);			//查询实例对象中是否有该键
map.delete(key);		//删除指定的键值对
map.clear();			//删除所有的键值对
```

> 与Object只能使用数值、字符串或者符号作为键不同，Map可以使用任何JavaScript数据类型作为键



**顺序与迭代**

> 与Object类型的一个主要差异是，Map实例会维护键值对的插入顺序，因此可根据插入顺序执行迭代操作，
>
> 映射实例可以提供一个迭代器（Iterator），能以插入顺序生成[key，value]形式的数组，可以通过entries方法或者[Symbol.iterator]属性获得这个迭代器

```
const map = new Map([
    ["key1", "val1"],
    ["key2", "val2"],
    ["key3", ""val3"]
]);

alert(map.entries() === map[Symbol.iterator]);	//true
```



#### 4.WeakMap

> ES6新增的“弱映射”是一种新的集合类型，WeakMap中的“weak（弱）”，描述的是JavaScript垃圾回收程序对待“弱映射”中键的方式，其API是Map的子集

**弱映射中的键只能是Object类型或者继承自Object的类型**

> Map存在两个很大的缺点：
>
> 1.首先赋值和搜索操作都是O（n）的时间复杂度（n是键值对的个数），因为这两个操作都需要遍历整个数组来进行匹配。
>
> 2.另外一个缺点就是可能会导致内存泄漏，因为数组会一直引用着每个键和值，这种引用使得垃圾回收算法不能回收处理他们，即使没有任何其他引用存在了

> 相比之下，原生的WeakMap持有的是每个键对象的“弱引用”，这意味着没有其他引用存在时，垃圾回收能正确进行。原生WeakMap的结构是特殊且有效的，其用于key只有在没有被回收时才是有效的

**正是由于这样的弱引用，WeakMap的key是不可枚举的**（没有方法能给出所有的key）



#### 5.Set和WeakSet

> ES6新增的Set是一种新集合类型，为这门语言带来集合数据结构，Set在很多方面都像是加强的Map，因为他们的大多数API和行为都是共有的

这里不介绍这两个集合类型了，和Map非常相似