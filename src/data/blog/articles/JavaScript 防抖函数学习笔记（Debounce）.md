---
title: JavaScript 防抖函数学习笔记（Debounce）
slug: javascript-debounce-function-explained
excerpt: 这份笔记系统介绍了JavaScript防抖函数（debounce）的概念、常见应用场景及两种实现方式：普通版本和带立即执行（immediate）版本。通过代码示例和详细解析，说明了防抖函数如何有效控制函数触发频率，避免频繁执行带来的性能问题。此外，还涵盖了立即执行与延迟执行的区别及高级用法，帮助开发者更灵活地应用防抖技术优化用户体验和系统性能。
tags:
  - JavaScript
createdAt: 2025-05-20T17:17:27+08:00
updatedAt: 2025-05-20T17:17:27+08:00
---
## 一、什么是防抖（Debounce）

**防抖（Debounce）**：一种控制函数执行频率的技术。  
**核心原理**：某个函数在被频繁触发时，只有在 *最后一次触发后的 N 秒内不再触发* 才执行。

---

## 二、常见应用场景

| 场景                     | 说明                       |
|--------------------------|----------------------------|
| 搜索框输入联想           | 停止输入一段时间后发请求   |
| 窗口尺寸变化监听（resize）| 用户停止调整后再重新布局   |
| 按钮点击防连点           | 防止用户连续点击多次       |

---

## 三、普通版防抖函数（不立即执行）

### ✅ 代码：

```js
function debounce(fn, delay = 300) {
  let timer = null;

  return function (...args) {
    const context = this;

    clearTimeout(timer); // 清除上一次的定时器

    timer = setTimeout(() => {
      fn.apply(context, args); // 延迟执行函数
    }, delay);
  };
}
```

### 🧠 解析：

- 每次调用都会 **清除上一次的定时器**
- 然后重新设置一个新的定时器
- 只有用户停止触发 delay 毫秒后，函数才会执行
- 函数 `fn` 的上下文 `this` 和参数 `args` 都被正确保留

---

## 四、带立即执行的防抖函数（immediate = true）

### ✅ 代码：

```js
function debounce(fn, delay = 300, immediate = false) {
  let timer = null;

  return function (...args) {
    const context = this;

    const callNow = immediate && !timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    }, delay);

    if (callNow) {
      fn.apply(context, args);
    }
  };
}
```

### 🧠 解析：

- 增加了 `immediate` 参数，用于控制是否 **第一次立即执行**
- `callNow = immediate && !timer`：
  - 只有在 `immediate = true` 且 `timer = null`（冷却中）时，才会立即执行
- `timer = setTimeout(...)` 会在延迟后将 `timer` 清空，使得下一次能再次立即执行
- 如果 `immediate = false`，行为就和普通版本一样

---

## 五、行为对比说明

| immediate 值 | 首次触发 | 多次连续触发 | 停止触发后 |
|--------------|-----------|----------------|----------------|
| false        | 不执行    | 一直清除定时器 | 最后一次延迟后执行 |
| true         | 立即执行  | 不再触发       | 冷却后允许再次立即执行 |

---

## 六、使用示例

```js
const log = () => console.log('触发');

const debounced = debounce(log, 1000, true);

debounced();            // 立即执行
setTimeout(debounced, 300);  // 忽略
setTimeout(debounced, 600);  // 忽略
setTimeout(debounced, 1100); // 间隔超时，重新立即执行
```

---

## 七、拓展：立即执行 + 最后一次触发也执行（高级需求）

```js
function debounce(fn, delay = 300, immediate = false) {
  let timer = null;
  let called = false;

  return function (...args) {
    const context = this;

    if (immediate && !called) {
      fn.apply(context, args);
      called = true;
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      if (!immediate || !called) {
        fn.apply(context, args);
      }
      called = false;
    }, delay);
  };
}
```

### ✨ 特点：

- 既能首次立即执行
- 又能在最后一次触发后也执行一次（可选行为）

---

## 八、总结

- 防抖用于减少频繁操作带来的性能问题
- 关键点在于 `clearTimeout` 和 `setTimeout`
- 是否立即执行取决于 `immediate` 参数
- 更复杂需求时可自行组合 `首次触发 + 最后触发`