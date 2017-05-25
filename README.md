# AVOS Cloud Chat SDK for JavaScript

[![Greenkeeper badge](https://badges.greenkeeper.io/hax/avos-chat.svg)](https://greenkeeper.io/)

## NOTE

本SDK是在AVOS Cloud（现LeanCloud）的实时通讯服务早期开发的，当时官方只有iOS/Android SDK。
现时普通用户建议使用LeanCloud的官方SDK：[leancloud/js-realtime-sdk](https://github.com/leancloud/js-realtime-sdk)。


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


## 版权和许可

&copy; 2014, 2015 百姓网

Copyright (c) 2014, 2015 baixing.com<br>
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.<br>
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
