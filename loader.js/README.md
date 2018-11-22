# loader.js

解决问题(需求)：某些功能性文件不需要随页面首次进行加载吗，而是功能方法被访问时再去请求对应的文件

_eg._

```js
import bodymovin from './bodymovin.min.js'

bodymovin.loadAnimation()
```

_预期效果_
```js
loader.require('bodymovin', function () {
    // when loaded or had loaded
}, function () {
    // when loading
})
```
