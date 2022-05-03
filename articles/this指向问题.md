---
title: this的指向问题
category: Javascript
date: 2022-3-24
---

通过一道面试题，分析面试经常遇到的一些问题

```
var name = 'window';
function Person(name) {
    this.name = name;
    this.foo = function() {
        console.log(this.name);
        return function() {
            console.log(this.name);
        }
    }
}

let person1 = new Person('person1');
let person2 = new Person('person2');

person1.foo.call(person2)();
person1.foo().call(person2);
```

其实这个题目也没这么难，主要是要思路清晰，我们先看看this指向有哪些情况：

1.在全局上下文中默认this指向window，严格模式下指向undefined

2.直接调用函数，例如：

```
var name = 'wk';
let obj = {
    name: 'chj',
    test() {
        console.log(this.name);
    }
}
let fn = obj.test;
fn();	//wk
```

   在上面的代码中，其实就是直接调用了test函数，要知道，this的指向是执行才确定的，也就是说，谁最后调用了这个函数，this就指向谁（当然，箭头函数除外，后面会讲）

3.对象.方法的形式调用

```
var name = 'wk';
let obj = {
    name: 'chj',
    test() {
        console.log(this.name);
    }
}
obj.test();	//chj
```

   在这种情况下，直接调用者就是obj了，因此，this指向obj，输出的也就是chj

4.new + 构造函数

使用new创建一个对象，构造函数创建对象过程中的this指向的是创建的实例对象，并且优先级 > bind/call/apply > 对象.方法 > 直接调用

```
   let fn = function(name) {
       this.name = name;
   };

   let obj1 = {
       foo: fn
   }

   obj1.foo('chj');		
   console.log(obj1.name);		//chj
   let obj2 = {};
   obj1.foo.call(obj2, 'wk');
   console.log(obj2.name);		//wk
   let obj3 = new obj1.foo('sanyuan');

   //下面的输出说明：new的优先级比对象.方法调用的形式优先级更高
   console.log(obj1.name);		//chj
   console.log(obj3.name);		//sanyuan

   //来比较一下显示绑定和new的优先级
   let obj4 = {};
   let bindFn = fn.bind(obj4);
   bindFn('xgp');
   console.log(obj4.name);		//xgp

   //可以看出new的优先级比显示绑定bind的优先级高
   let obj5 = new bindFn('chj');
   console.log(obj5.name);		//chj
```

5.显示绑定，也就是上面那个例子的call/apply/bind

6.最后就是箭头函数了，了解过箭头函数的都知道，箭头函数没有自己的this，它的this会指向到当前最近的父级非箭头函数的this

```
   var name = 'wk';
   let obj = {
   	name: 'chj',
       foo() {
           let test = function() {
               console.log(this.name);
           }
           test();
       }
   }
   obj.foo();		//wk
   //再看看另外一种形式
   var name = 'wk';
   let obj = {
   	name: 'chj',
       foo() {
           let test = () => {
               console.log(this.name);
           }
           test();
       }
   }
   obj.foo();		//chj
```

   第一个例子，属于是直接调用了test函数，则this默认指向window，因此输出的是wk；第二个例子，我们可以看到，test是一个箭头函数，它的this指向的是最近的父级非箭头函数的this，也就是foo的this，因此也就是obj，所以输出的是chj

现在我们回到之前的题目，这里把它拿过来：

```
var name = 'window';
function Person(name) {
    this.name = name;
    this.foo = function() {
        console.log(this.name);
        return function() {
            console.log(this.name);
        }
    }
}

let person1 = new Person('person1');
let person2 = new Person('person2');

person1.foo.call(person2)();
person1.foo().call(person2);
```

先从第一个问题分析，首先我们调用了`person1.foo`并使用`call`显示绑定了`person2`，因此这里输出的是`person2`字符串，然后调用返回的函数，这里属于直接调用，因此输出的是`window`；

再看看第二个，首先调用`person1.foo`，对象.方法的调用形式，因此，输出`person1`字符串，然后调用返回的函数，并使用`call`绑定`person2`对象，因此输出的是`person2`。

接下来我们看一道有点复杂的题目，涉及到作用域，变量提升各方面的综合问题：

```
function Foo() {
    getName = function() { console.log(1); };
    return this;
}

Foo.getName = function() { console.log(2); };
Foo.prototype.getName = function() { console.log(3); };

getName();

var getName = function() { console.log(4); };
function getName() { console.log(5); };

Foo.getName();
getName();
Foo().getName();
getName();

new Foo.getName();
new Foo().getName();
```

相信部分同学第一次看到这个题目可能和我的感受一样，人都晕了，因为这里面涉及到了很多的知识点，我们来看看它到底考了什么

下面我们直接从问题入手

```
function Foo() {
    getName = function() { console.log(1); };
    return this;
}
Foo.getName = function() { console.log(2); };
Foo.prototype.getName = function() { console.log(3); };

//直接调用这个函数，我们可以看看前面声明了这个函数没，结果没有
//然后我们可以往下看，可以看到一个变量声明，一个函数声明，这里函数声明
//提升会优于变量声明提升，具体细节后面补充一下，因此会输出5
getName();		//5

var getName = function() { console.log(4); };
function getName() { console.log(5); };
//这里直接调用了Foo对象的getName，因此输出2，这个容易理解
Foo.getName();		//2

//这里和第一个函数一样的调用，不过，此时，因为getName进行了赋值
//执行了以下代码 getName = function() { console.log(4); };
//因此输出4

//这里首先调用了Foo函数，这里我们可以看到，getName没有使用var或者let进行
//创建，因此会成为一个全局变量，
//即window.getName = function() { console.log(1); };
//接着他返回了this，此时，因为是直接调用了Foo函数，this默认指向window
//接下来就是执行window.getName，因此输出的是1
Foo().getName();		//1

//上面已经分析了，window.getName = function() { console.log(1); };
//所以这里输出的也是1
getName();		//1

//这里貌似这个new有没有都没什么区别，就是调用了Foo.getName
new Foo.getName();		//2

//首先会创建一个new出来的新对象，并且对象的原型指向了构造函数的原型对象
//然后，会调用这个对象的getName方法，我们发现，它自身是没有这个方法的
//于是，它会顺着原型链查找，于是找到了：
//Foo.prototype.getName = function() { console.log(3); };
//因此这里输出的是3
new Foo().getName();	
```

刚上面我们提到了函数声明提升和变量提升，下面我们来分析一下：

JS在编译阶段，函数声明和变量声明都会被先处理，置于执行环境的顶部，且赋值留在原地，这个过程被称为提升。

举个简单例子：

```
console.log(i);
var i = 1;
function fn() {
    console.log(1);
}
```

实际代码顺序是这样的：

```
function fn() {
    console.log(1);
}
var i;
console.log(i);
i = 1;
```

而这里要注意的是函数声明和变量声明的提升优先级以及一些注意点：

```
fn();//1
function fn() {
    console.log(1);
}

fn();//1

var fn = function() {
    console.log(2);
}

fn();//2
//其实上面的代码就相当于
//函数声明提升优先级高

function fn() {
    console.log(1);
}

//这里要注意的是，变量声明不会覆盖函数声明
var fn;

//因此这里输出的是1
fn();//1
fn();//1

//这里重新赋值了，因此覆盖了之前的函数声明
fn = function() { console.log(2); };

fn();//2
```