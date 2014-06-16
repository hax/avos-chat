# AVOS Cloud Chat SDK for JavaScript

## Requirements

1. ECMAScript 5
2. WebSocket、XMLHttpRequest、Promise

没有原生支持上述特性的老浏览器需要自行 shim。
Node.js 下用的分别是 ws、xmlhttprequest、es6-promise 模块。

## API 设计

1. 使用 ES6 的 Promise API
2. 使用 Node.js 的 EventEmitter 风格的事件接口

## Coding style

1. 使用 [npm“funny”风格](https://www.npmjs.org/doc/coding-style.html) ，但是：
	* 缩进使用 tab
	* 不前置逗号

1. 关于分号和换行的补充
	1. 除去注释后，若语句结束于行末，不额外加“;”
	1. 除去注释后，若语句开始于行首，且语句的第一个符号为“(”、“[”、“/”、“+”、“-”之一，在该符号前加“;”或“void”
	1. 单个语句如需折行，需确保折行时处于显著的未结束状态（如行末为二元运算符，或 open 括号）

