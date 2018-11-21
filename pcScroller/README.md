# PC端滚动条样式优化 - JS方案

## Classes

<dl>
<dt><a href="#PCScroller">PCScroller</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#refreshDOM">refreshDOM()</a></dt>
<dd><p>当内部元素发生变化时，应调用此方法刷新滚动位置</p>
</dd>
</dl>

<a name="PCScroller"></a>

## PCScroller
**Kind**: global class

* [PCScroller](#PCScroller)
    * [new PCScroller(root)](#new_PCScroller_new)

<a name="new_PCScroller_new"></a>

pc端滚动条样式优化

### new PCScroller(root)

| Param | Type | Description |
| --- | --- | --- |
| root | <code>Node</code> | 滚动节点 |

<a name="PCScroller"></a>

## PCScroller
**Kind**: global class

* [PCScroller](#PCScroller)
    * [new PCScroller()](#new_PCScroller_new)
    * [new PCScroller(root)](#new_PCScroller_new)

<a name="new_PCScroller_new"></a>

### new PCScroller(root)

| Param | Type | Description |
| --- | --- | --- |
| root | <code>Node</code> | 滚动节点 |

<a name="refreshDOM"></a>

## refreshDOM()
当内部元素发生变化时，应调用此方法刷新滚动位置

**Kind**: global function
**Access**: public

# 注意事项

1. refreshDOM() 应为手动调用，结合vue可以放置在updated调用

2. 内部原理添加了滚动条节点，当滚动内容增加时，滚动条节点的dom list位置并不会发生变化，所以对于:nth-child()有一定影响，请悉知
