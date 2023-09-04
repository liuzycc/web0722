大家之前有没有阅读过源码？

大家认为，阅读源码的目的是什么？

- 应付面试
- 知道原理
- 学习框架设计思想

功利心作祟

学习源码怎么入手？
1. 先使用并数量掌握框架的基本 API
2. 循着 API 去尝试理解它背后的原理
3. 系统性思考框架设计的思想

## 开始阅读源码
### 阅读顺序
1. 下载源码，并打开
2. 从 `package.json` 入手
3. 分析项目入口
  1. main 指的是？commonjs 规范入口
  2. module 指的是？esm 规范入口
4. 分析脚本
  1. dev
  2. build，vue 的构建是使用 rollup 做的

5. 观察整个项目的结构，stree
### 源码结构分析
Vue2 源码
  ├─.babelrc.js
  ├─.circleci
  │    └─config.yml
  ├─.editorconfig
  ├─.eslintignore
  ├─.eslintrc.js
  ├─.flowconfig
  ├─BACKERS.md
  ├─LICENSE
  ├─README.md
  ├─benchmarks
  ├─dist
  ├─examples
  ├─flow
  │    ├─compiler.js
  │    ├─component.js
  │    ├─global-api.js
  │    ├─modules.js
  │    ├─options.js
  │    ├─ssr.js
  │    ├─vnode.js
  │    └─weex.js
  ├─package.json
  ├─packages
  │    ├─vue-server-renderer
  │    ├─vue-template-compiler
  │    ├─weex-template-compiler
  │    └─weex-vue-framework
  ├─scripts
  ├─src
  │    ├─compiler
  │    ├─core
  │    ├─platforms
  │    ├─server
  │    ├─sfc
  │    └─shared
  ├─test
  ├─types
  │    ├─index.d.ts
  │    ├─options.d.ts
  │    ├─plugin.d.ts
  │    ├─test
  │    ├─tsconfig.json
  │    ├─typings.json
  │    ├─umd.d.ts
  │    ├─vnode.d.ts
  │    └─vue.d.ts
  └─yarn.lock

vue 迭代的过程中，引入了 monorepo 方案（在一个项目里有多个项目 package.json）。
我们重点关注的 Vue 源码内容——**packages**、**src**。

```js
new Vue({
  
})
```

入口文件 `src/core/index.js`，一切的一切从这里开始。

### 类型安全的问题

大家平时开发用 js 遇到过很多问题

- Typescript
- Flow 与 ts 对比学习
- jsdoc
- tsdoc

使用 flow 的 js 文件，只需要 `/* @flow */` 在文件开头标注即可

### 带大家分析整个框架目录的设计
一定要保证文件夹和文件命名语义化。

- compiler，编译器
- core，核心逻辑
- platforms，平台，适配不同端，为了抹平 core 包在不同平台的差异的
- server，服务端，服务端渲染有关
- sfc，source code format compiler，把 .vue 文件解析转换为 JavaScript 对象。jsx/tsx -> React.createElement（babel）
- shared，共享，包的公共逻辑

判断一个参数是否是对象，typeof obj === 'object'，null。

## 正式阅读源码
从 Vue 入口开始

### core/index.js

我们这里用一个流水线表示 Vue 从初始化到更新完成整个过程
1. new Vue()
2. initGlobalAPI，初始化一些全局的 API
  - nextTick
  - vue 2.6+ observable
  - initUse（初始化 Vue 插件系统）、initMixin（初始化 Mixin）、initExtend、initAssetRegisters（component、directive、filter）
3. initMixin -> 
  - initLifecycle(vm)，初始化生命周期相关处理（$children、$refs、_isMounted）
  - initEvents(vm)，初始化事件系统
  - initRender(vm)，初始化渲染器
  - callHook(vm, 'beforeCreate')，调用生命周期，这时就证明了你无法在该生命周期中访问 Vue 状态
  - initInjections(vm) // resolve injections before data/props
  - initState(vm)
  - initProvide(vm) // resolve provide after data/props
4. $mount（src/platforms/web/runtime/index.js）
  - mountComponent，
    - 如果没有render，createEmptyVNode
    - callHook(vm, 'beforeMount')
    - new Watcher
    - callHook(vm, 'mounted')
  - watcher
    - this.deps = []、this.newDeps = []
    - let data = vm.$options.data
      proxy(vm, `_data`, key)
    - initState
  - updateComponent
5. $destroy

### diff
更新时，需要进行 diff，但是 vue2 是全量双端 diff，所以其实存在一定的效率问题，可以更进一步优化。
![Alt text](blob:https://y03l2iufsbl.feishu.cn/4682f67d-2c50-4a5c-b19f-337145874c24)

关于 patch 源码/src/core/vdom/patch.js

### key 的作用我们从这里可以看出
```js
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.asyncFactory === b.asyncFactory && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

关于节点的 patch

```js

  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }
```



Vue 为什么选择用原型继承来实现？
之所以不用 class Vue {}，是因为原型继承方便进行对象实例的属性和方法共享，并且易于拓展。
vue-router 源码
```js
  app.config.globalProperties.$router = router
  Object.defineProperty(app.config.globalProperties, '$route', {
    enumerable: true,
    get: () => unref(currentRoute),
  })
```
