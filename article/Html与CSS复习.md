---
title: HTML与CSS总结
category: CSS
date: 2021-11-28
---

#### HTML语义化

为什么要使用语义化标签呢？在开发过程中，我们使用DIV+CSS也能做出一样的效果，单纯看效果，两者并没有什么区别，但是，页面不单是只给用户看的，浏览器也要看的，以及我们后续的维护也要看代码的。清晰、具有语义化的网页结构对浏览器更友好，更有利于开发者进行后期维护。

##### 优点：

- 语义化标签有助于构造良好的HTML结构，无CSS时也能进行网页阅读
- 有利于搜索引擎的建立索引、抓取。简单来说，试想一下h1标签中匹配到的关键词和在div中匹配到的关键词，搜索引擎会把哪个结果放在前面。
- 有利于构建清晰的结构，有利于团队的开发、维护。



#### 常见的水平垂直居中问题

**对于`行内元素`**

 水平居中：`text-align: center;`

 垂直居中：`line-height: height`    此处的height指的是包裹行内元素的高度



**对于块级元素**

**水平居中：**

（1）可以使用margin实现：`margin:0 auto;`

（2）使用position实现：子绝（absolute）父相（relative），`left:50%; margin-left:-width/2 //此处的width为子元素的width，因此使用此方法需要已知子元素宽度`

（3）使用transform加（2）中的方法：将margin-left改为：`transform:translateX(-50%);`

（4）使用flex布局：在父元素中：`display:flex; justify-content:center;`

**垂直居中：**

> 存在margin塌陷问题，使用bfc解决，当然，也可以使用土办法：border-top: 1px solid

（1）使用子绝父相+margin：`top:50%; margin-top:-height/2;（或者 tranform:translateY(-50%)）;`

（2）使用flex布局：`align-items:center;`



#### 浮动布局以及清除浮动

> 浮动布局：当元素浮动以后，向左或向右移动，直到它的外边缘碰到包含它的框或者另外一个浮动元素的边框为止；元素浮动以后会脱离正常的文档流，所以文档中的普通流看不到浮动元素。

**优点**

浮动布局最大的优点就是实现文字环绕图片效果，起初创建浮动布局的作者也是为了达到这个效果。浮动元素有着块级元素的一些性质：例如可以设置宽高，但是它与inline-block还是有区别的，inline-block在使用时有时会存在空白间隙的问题（凡是自带inline特效的元素，都有文字特性，两个文字之间会被分割，因此形成间隙）。

**缺点**

无法撑起父元素，造成父级元素高度塌陷



**清除浮动**

（1）添加额外标签：在要清除浮动元素后面加一个块级标签，并使用 `clear:both`

（2）父级添加overflow属性（但是不能为visible）

（3）使用伪类选择器清除浮动

```JavaScript
:after{
    content:'';
    display:block;  //必须为块级元素
    clear:both;
}
```



#### BFC(块级格式化上下文)

（1）BFC是一个独立的渲染空间，内部元素的渲染不会影响到边界以外的元素。

（2）应用：BFC可以看作是一个CSS元素

- 触发条件：float的值不为none；overflow的值不是visible；display为flex，inline-block，table-cell等等；position为absolute或者fixed；



- 解决问题：float的高度塌陷；margin的边距重叠（原理就是将边距重叠的块级元素放进一个盒子里面，此盒子是BFC，当求margin上的垂直距离时，会以它为标准，从而解决margin重叠问题）


```javascript
.container {
        background-color: green;
        overflow: hidden;
    }

.inner {
    background-color: lightblue;
    margin: 10px 0;
}
.test{
    overflow: hidden;
}
<div class="container">
    <div class="inner">1</div>
    <div class="test"><div class="inner">2</div></div>     //此处记得包裹一个块级元素
    <div class="inner">3</div>
</div>		
```



#### Flex布局

##### 基本概念

任何一个容器都可以指定为Flex布局

```javascript
.box{
    display: flex;
}
```

行内元素也可以使用Flex布局

```javascript
.box{
    display: inline-flex;
}
```

> 在设置为Flex布局后，子元素的float、clear和vertical-align属性将失效

采用Flex布局的元素，称为Flex容器，它的成员自动成为容器成员，称为Flex项目

容器默认存在两根轴，水平的主轴和垂直的交叉轴。

##### 容器的属性

- flex-direction：决定主轴的方向，默认为row（项目从左至右依次排列）

  ```javascript
  .box{
      flex-direction: row | row-reverse | column | column-reverse;
  }
  ```

- flex-wrap：决定项目是否换行，默认为no-wrap

  ```javascript
  .box{
      flex-wrap: nowrap | wrap | wrap-reverse(第一行在下方，即进行换行的项目排列在第一行);
  }
  ```

- flex-flow：flex-direction和flex-wrap的简写形式

  ```javascript
  .box{
      flex-flow: <flex-direction> | <flex-wrap>;
  }
  ```

- justify-content：决定项目在主轴上的对齐方式，默认为flex-start

  ```javascript
  .box{
      justify-content: flex-start | flex-end | center | space-between（两端对齐，项目之间的间隔都相等） | space-around(项目两侧的间隔都相等，所以，项目之间的间隔比项目与边框的间隔大一倍);
  }
  ```

- align-items：决定项目在交叉轴上如何对齐，默认为stretch

  ```javascript
  .box{
      align-items: flex-start | flex-end | center | baseline(项目的第一行文字的基线对齐) | stretch(如果项目未设置高度或设为auto，将占满整个容器的高度);
  }
  ```

##### 项目的属性

- order：定义项目的排列顺序，数值越小，排列越靠前，默认为0
- flex-grow：定义项目的放大比例，默认为0，即如果存在剩余空间，要不放大
- flex-shrink：定义项目的缩小比例，默认为1，即如果空间不足，将项目缩小
- flex-basis：定义了在分配多余空间之前，项目占据的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间，默认值为auto，即项目的本身大小
- flex：是flex-grow、flex-shrink和flex-basis的简写，默认值为0 1 auto；auto（1 1 auto）和none（0 0 auto）；
- align-self：允许单个项目与其它项目不一样的对齐方式，可覆盖align-items属性，默认为auto，即继承父元素的align-items属性。