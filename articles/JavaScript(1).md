---
title: JavaScript笔记（1）
category: JavaScript
date: 2021-12-28
---


## 第三章  语言基础

变量

1.var关键字

- 声明作用域：

  使用var操作符定义的变量会成为包含它的函数的局部变量：

  ```
  function test(){
      var message = 'hi';
  }
  test();
  console.log(messsage);	//报错
  ```

  而在函数内部定义变量时，省略var操作符，会创建一个全局变量：

  ```
  function test(){
      message = 'hi';
  }
  test();
  console.log(messsage);	//"hi"
  ```

- 声明提升：

  ```
  function foo(){
      console.log(age);	
      var age = 21;
  }
  foo()	//undefined
  ```

2.let声明

- 声明作用域：

  let声明的范围是块作用域，而var声明的范围是函数作用域

  ```
  if(true){
      let age = 21;
      console.log(age);	//21
  }
  console.log(age)	//报错
  ```

- 在同一作用域中，不可重复声明：

  ```
  let age = 21;
  let age = 20;	//报错：age已经声明过了
  ```

- 暂时性死区：

  let与var的另一个重要区别，就是let声明的变量不会在作用域中被提升

  ```
  console.log(age);	//报错，age没有定义
  let age = 21;
  ```

  > 在解析代码时，JavaScript引擎也会注意在块后面的let声明，只不过在此之前不能以任何方式来引用未声明的变量。在let声明之前的瞬间被称为“暂时性死区”，在此阶段引用任何后面才声明的变量都会抛出错误。

  ```
  var age = 22;
  function test(){
      console.log(age);	//报错
      let age = 22;
  }
  test();
  ```

- 全局声明：

  与var关键字不同，使用let在全局作用域声明的变量不会成为window对象的属性

  ```
  var name = "chj";
  console.log(window.name);	//"chj"

  let name = "chj";
  console.log(window.name);	//undefined
  ```

3.const声明

- const的行为与let基本相同，唯一一个重要的区别就是用const声明时，必须同时初始化变量，且尝试修改const声明的变量会导致运行时报错

  ```
  const age = 21;
  age = 20;	//报错：给常量赋值
  ```



数据类型

- 简单数据类型：

  undefined，Boolean，null，symbol，string，number，bigint（基本没用过，新出的）

- 复杂数据类型：

  Object（包括普通对象Object，数组对象Array，正则对象RegExp，日期对象Date，数学函数Math，函数对象Function)



判断数据类型

- 对于基本数据类型来说，除了null都可以调用typeof显示正确的类型：

  ```
  typeof 1      //'number'
  typeof '1'    //'string'
  typeof true   //'boolean'
  typeof undefined    //'undefined'
  typeod Symbol()     //'symbol'
  typeof null    //'object'
  ```



- 对于复杂数据类型，除了函数之外，都会显示object

  ```
  typeof []  //'object'
  typeof {}  //'object'
  const test = function(){
      console.log(1);
  }
  console.log(typeof test);  //'function'
  ```

  > 这里可以实现一下判断复杂对象数据类型：

  ```
  const myTypeof(obj){
      return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase;
  }
  console.log(mytypeof([]));  //'array'
  console.log(mytypeof({}));  //'object'
  ```

  > 当然，这里也可以使用instanceof来判断复杂数据类型

  ```
  console.log([] instanceof Array);   //true
  console.log({} instanceof Object);  //true

  //instanceof的原理就是顺着要判断的对象的原型链向上查找，若能找到对应构造函数的原型对象，则返回true，否则返回false
  ```

  > 这里手动实现一下instanceof的功能

  ```
  function myInstanceof(obj, constructor){
  	//不是对象数据类型则返回false，其没有原型
      if(typeof obj !== 'object' || typeof obj === null){
          return false;
      }
      //先拿到该对象的向上找的第一个原型对象
      let proto = Object.getPrototypeOf(obj);
      while(true){
          if(proto === constructor.prototype){
              return true;
          }
          if(proto === null){
              return false;
          }
          proto = Object.getPrototypeOf(proto);
      }
  }

  console.log(myInstanceof([], Array));   //true;
  console.log(myInstanceof({}, Object));  //true;
  ```



- 数据类型的转换

  类型转换只有三种：

  - 转换为数字
  - 转换为布尔值
  - 转换为字符串

  **转换为数字：**

  ```
  string --->  '1' => 1, 'a' => NaN, '1a' => NaN
  数组 ---->  空数组为0，存在一个元素且为数字转化为数字，其他情况为NaN
  null ---->  0
  除了数组的引用类型 ---->  NaN
  Symbol -----> 报错
  ```

  **转化为布尔值：**

  ```
  number ----> 除了0，-0，+0，NaN都为true
  string ----> 除了空串都为true
  undefined,null ----> false
  引用类型 ---->  true
  ```

  **转换为字符串：**

  ```
  number ---->  5 => '5'
  Boolean，函数，Symbol  ---->  'true'
  数组 ----->  [1,2] => '1,2'
  对象 ------>  '[object,Object]'
  ```

- ===和==的区别

  **===判断类型是否相同，不相同直接返回false，而==涉及到一些类型转换**

  - 两边的类型相同，直接比较值的大小
  - 判断两边是否分别是null和undefined，是的话，直接返回true
  - 判断的类型是否是String和Number，是的话，把String类型转换成Number，再进行比较
  - 判断其中一方是否是Boolean，是的话就把Boolean转换成Number，再进行比较
  - 如果其中一方为Object，且另一方为String、Number或者Symbol，会将Object转换成字符串，再进行比较

  ```
  {} == true //false，首先，{}转换为字符串（"[object,Object]"）,然后再转化为number（NaN），右边为1，所以为false
  ```

  > 此处的Object转化为字符串，这涉及到每个Object中都有一个实例：valueOf()，其返回对象对应的字符串，数值或者布尔值，通常与toString()的返回值相同

  ```
  常见的应用：a == 1 && a == 2 //true
  const a = {
      value:1,
      valueOf(){
          return this.value++;
      }
  }
  console.log(a == 1 && a == 2);	//true
  ```



- Object.is和===的区别

  主要体现在+0和-0，NaN和NaN的判断上，修复了===的一些失误

  在===中：

  ```
  console.log(+0 === -0);    //true
  console.log(NaN === NaN);  //false
  ```

  在Object.is中：

  ```
  console.log(Object.is(+0,-0));     //false;
  console.log(Object.is(NaN,NaN));   //true;
  ```




##第四章  变量、作用域与内存

原始值与引用值

- 原始值是最简单的数据

  保存原始值的变量是按值访问的，因为我们操作的就是存储在变量中的实际值

- 引用值是由多个值构成的对象

  JavaScript不允许直接访问内存地址，因此不能直接操作对象所在的内存空间，在操作对象时，实际上操作的是对该对象的引用而非实际的对象本身。

- 复制值

  ```
  let num1 = 5;
  let num2 = num1;
  ```

  > 这里，num1包含数值5，当把num2初始化为num1时，num2也会得到数值5，这个值根存储在num1中的5是完全独立的，互不干扰

![1](../src/assets/image/JavaScript(1)/a.jpg)

```
let obj1 = new Object();
let obj2 = obj1;
obj1.name = "chj";
console.log(obj2.name);		//"chj"
```

![2](../src/assets/image/JavaScript(1)/b.jpg)



- 传递参数

  所有的函数的参数都是按值传递的

  **参数为简单数据类型：**

  ```
  function test(num){
      num += 10;
      return num;
  }
  let count = 20;
  let result = test(count);
  console.log(count);		//20，没有变化
  console.log(result);	//30
  ```

  **参数为引用数据类型：**

  ```
  function test(obj){
      obj.name = "jun";
      obj = new Object();
      obj.name = "hui";
  }
  let person = new Object();
  person.name = "chen";
  test(person);
  console.log(person.name);	//"jun"

  这个函数内部，先是对obj的name属性进行操作，然后，将obj重新定义为一个有着不同name的新对象，如果person是按引用传递的，那么person的name属性将被改成“hui”，但是，我们再次访问name属性时，它的值为第一次操作的值。当obj在函数内部重写时，他变成了指向本地对象的指针，而那个对象在函数执行结束后就销毁了。
  ```


执行上下文（Context）与作用域(Scope)

> 执行上下文的概念非常重要，但是也很难理解，函数的每次调用都有与之紧密相关的作用域和上下文。从根本上来说，作用域是基于函数的，而上下文是基于对象的。 换句话说，作用域涉及到所被调用函数中的变量访问，并且不同的调用场景是不一样的。上下文始终是`this`关键字的值， 它是拥有（控制）当前所执行代码的对象的引用.

- **变量或函数**的执行上下文决定了它们可以访问哪些数据，以及它们的行为，每个上下文都有一个关联的**变量对象**，而这个上下文中定义的所有变量和函数都存在于这个对象上。
- 全局上下文是最外层的上下文，在浏览器中，全局上下文就是我们常说的window对象
- 每个函数调用都有自己的上下文，当代码执行流进入函数时，函数的上下文会被推到上下文栈上，函数执行完后，上下文栈会弹出该函数上下文（执行完函数，销毁其变量）
- 上下文的代码在执行的时候，会创建变量对象的一个**作用域链**，这个作用域链决定了各级上下文的代码在访问变量和函数时的顺序。如果上下文是函数，则其**活动对象**用作变量对象，活动对象最初只有一个定义变量：arguments。（全局上下文中没有这个变量）

```
var color = "blue";

function changeColor(){
    let anotherColor = "red";
    
    function swapColor(){
        let tempColor = anotherColor;
        anotherColor = Color;
        color = tempColor;
        
    //这里可以访问color，anotherColor和tempColor
    }
    
    //这里可以访问color，anotherColor
    swapColor();
}

//这里只能访问Color
changeColor();

以上代码涉及到三个上下文：全局上下文，changeColor()的局部上下文和swapColor()的局部上下文
```

![3](../src/assets/image/JavaScript(1)/c.jpg)

> 以上一图就很好地解释了：每个上下文都有一个关联的变量对象，上下文中定义的所有变量和函数都存在于这个对象上


内存管理

> 至于内存管理，涉及到v8引擎关于如何进行垃圾回收的原理，后续我会专门写一篇总结