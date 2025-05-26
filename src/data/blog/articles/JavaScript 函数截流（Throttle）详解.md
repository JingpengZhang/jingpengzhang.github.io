---
title: JavaScript 函数截流（Throttle）详解
slug: javascript-throttle-function-explained
excerpt: 本文详细介绍了 JavaScript 中的截流（throttle）函数原理、应用场景、实现方式，并支持 leading 和 trailing 配置的进阶版本
tags:
  - JavaScript
createdAt: 2025-05-26T08:19:19+08:00
updatedAt: 2025-05-26T08:19:19+08:00
---

## 📌 什么是 Throttle（截流）？


`Throttle`（节流/截流）是前端开发中常用的性能优化技巧。**它可以限制一个函数在单位时间内最多只执行一次**，即便这个函数被连续触发多次。

  

---

  

## 🧠 应用场景

  

| 场景 | 描述 |

|----------------|------|

| 页面滚动事件 | 避免 `scroll` 滚动频繁触发函数造成卡顿 |

| 按钮重复点击 | 防止短时间内按钮被点击多次（比如发送短信） |

| 浏览器窗口 resize | 控制响应处理频率，避免频繁计算布局 |

| 鼠标拖拽移动 | 控制位置更新频率，提高性能 |

| 输入框联想请求 | 避免用户快速输入时请求过多 |

  

---

  

## 🧩 throttle 和 debounce 区别

  

| 特性 | throttle（节流） | debounce（防抖） |

|--------------|-----------------------------|-------------------------------|

| 定义 | N 秒内最多执行一次 | N 秒内不再触发才执行 |

| 触发频率 | 固定时间间隔 | 只有最后一次触发会执行 |

| 适合场景 | 高频执行需控制频率 | 用户输入等不连续触发的场景 |

  

---

  

## 🧪 throttle 简单实现

  

```js

function throttle(fn, wait) {

let lastTime = 0;

return function (...args) {

const now = Date.now();

if (now - lastTime >= wait) {

lastTime = now;

fn.apply(this, args);

}

};

}

```

  

### ✨ 特点：

- 每 `wait` 毫秒最多执行一次。

- 第一次调用立即执行。

  

---

  

## 🔧 进阶版 throttle（支持 `leading` 和 `trailing`）

  

### ✅ 功能说明

  

| 参数 | 类型 | 作用说明 |

|--------------|---------|----------|

| `leading` | boolean | 是否首次立即执行（默认 `true`） |

| `trailing` | boolean | 是否在最后一次触发后补执行一次（默认 `true`） |

  

---

  

### 📜 完整源码（含详细注释）

  

```js

/**

* 节流函数：控制函数在一定时间内只执行一次

* @param {Function} fn - 要执行的函数

* @param {number} wait - 节流间隔时间（毫秒）

* @param {Object} options - 可选配置项：

* - leading: 是否首次立即执行（默认 true）

* - trailing: 停止触发后是否补最后一次执行（默认 true）

* @returns {Function}

*/

function throttle(fn, wait, options = {}) {

let timeout = null; // 延迟执行的计时器

let previous = 0; // 上一次执行时间戳

let context, args; // 缓存 this 和参数

  

const later = () => {

previous = options.leading === false ? 0 : Date.now();

timeout = null;

fn.apply(context, args);

context = args = null;

};

  

return function (..._args) {

const now = Date.now();

  

// 如果 leading 为 false，第一次调用不立即执行

if (!previous && options.leading === false) {

previous = now;

}

  

const remaining = wait - (now - previous);

context = this;

args = _args;

  

// 已超出间隔时间，立即执行

if (remaining <= 0 || remaining > wait) {

if (timeout) {

clearTimeout(timeout);

timeout = null;

}

previous = now;

fn.apply(context, args);

context = args = null;

}

// 否则如果没有设置定时器，并允许 trailing，就补最后一次

else if (!timeout && options.trailing !== false) {

timeout = setTimeout(later, remaining);

}

};

}

```

  

---

  

## 🧪 示例使用

  

### 1. 立刻执行一次，结束后也执行（默认配置）

```js

const throttledFn = throttle(log, 2000);

```

  

### 2. 不立即执行，结束后才执行一次

```js

const throttledFn = throttle(log, 2000, { leading: false });

```

  

### 3. 立即执行一次，结束后不执行

```js

const throttledFn = throttle(log, 2000, { trailing: false });

```

  

### 4. 完全自控（首次不执行，结束后不执行）

```js

const throttledFn = throttle(log, 2000, { leading: false, trailing: false });

```

  

---

  

## 💡 使用建议

  

| 场景 | 推荐配置 |

|----------------------------|---------------------------------------|

| 按钮防止多次点击 | `leading: true, trailing: false` |

| 输入联想请求（搜索提示） | `leading: false, trailing: true` |

| 滚动节流 | `leading: true, trailing: true` |

| 只需一次触发的动画开关 | `leading: true, trailing: false` |
 

## ✅ 总结

  

- throttle 是控制函数执行频率的有效手段，适合高频操作。

- 可通过 `leading` / `trailing` 控制首次和最后一次执行的行为。

- 在实际项目中应根据业务需求合理配置节流策略。
