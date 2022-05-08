---
title: Promise
category: JavaScript
date: 2021-11-28
---

上次面试，面试官问到了Promise，虽然自己平时也用过，但是也只停留在用的层面，面试完后，自己好好看了一下Promise

#### 使用Promise

Promise是一个对象，它代表了一个异步操作的最终完成或者失败。

本质上Promise是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始就把回调函数作为参数传入这个函数了。

下面来具体讨论一下：

##### 约定

不同于“老式”的传入回调，在使用Promise时，会有以下约定：

- 在本轮事件循环运行完成之前，回调函数是不会被调用的。
- 即使异步操作已经完成（成功或失败），在这之后通过`then()`添加的回调函数也会被调用。
- 通过多次调用`then()`可以添加多个回调函数，它们会按照插入顺序执行。

##### 链式调用

链式调用是Promise很优秀的设计

连续执行两个或多个异步操作是一个常见的需求，在上一个操作执行成功之后，开始下一个操作，并带着上一步操作所返回的结果，我们可以通过创造一个Promise链来实现这种需求。

Promise出现之前，我们想要完成多重的异步操作，会导致经典的回调地狱：

```javascript
doSomething(function(result) {
    doSomethingElse(result, function(newResult) {
        doThirdThing(newResult, function(finalResult) {
            console.log(finalResult);
        }, failureCallback);
    }, failureCallback);
}, failureCallback);
```

我们可以看到，我们只是三个嵌套函数就已经很复杂了，而且代码很不雅观

现在，我们可以把回调函数绑定到返回的Promise上，形成一个Promise链：

```javascript
doSomething()
.then(result => {
    return doSomethingElse(result);
})
.then(newResult => {
    return doThirdThing(finalResult);
})
.then(finalResult => {
    console.log(finalResult);
})
.catch(failureCallback);
```

##### Catch的后续链式操作

有可能会在一个回调失败之后继续使用链式操作，即，使用一个catch，这对于在链式操作中抛出一个失败之后，再次进行新的操作会很有用。

```javascript
new Promise((resolve, reject) => {
    console.log('初始化');

    resolve();
})
.then(() => {
    throw new Error('有哪里不对了');

    console.log('执行「这个」”');
})
.catch(() => {
    console.log('执行「那个」');
})
.then(() => {
    console.log('执行「这个」，无论前面发生了什么');
});
```

输出结果如下：

```
初始化
执行“那个”
执行“这个”，无论前面发生了什么
```

##### 错误传递

通常，一旦遇到异常抛出，浏览器就会顺着Promise链寻找下一个onRejected失败回调函数或者由`.catch()`指定的回调函数。这和以下同步代码的工作原理非常相似。

```javascript
try {
    let result = syncDoSomething();
    let newResult = syncDoSomethingElse(result);
    let finalResult = synsDoThidThing(newResult);
    console.log(finalResult);
} catch(error) {
    failureCallback(error);
}
```

