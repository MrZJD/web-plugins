### 浏览器console.log chalk功能封装

```js
const {red, green, blue, _red, _green, _blue} = chalk
console.chalk(red('RED'), _red('RED LABEL'))
console.chalk(green('GREEN'), _green('GREEN LABEL'))
console.chalk(blue('BLUE'), _blue('BLUE LABEL'))

// 自定义样式
chalk.defineStyle('badge', 'background-color: #005caf; color: #fff; border-radius: 2px; padding: 0px 4px;')
console.chalk(chalk.badge('badge'))
```
