// 手写router
let Vue = null;

class HistoryRoute {
  constructor() {
    this.current = null; // 当前路由信息
  }
}

class VueRouter {
  constructor(options) {
    this.model = options.model || "hash";
    this.routes = options.routes || [];
    this.routesMap = this.createMap(this.routes);
    console.log(this.routesMap);
    this.history = new HistoryRoute();
    this.init();
    // {
    //   "path1":component1
    //   "path2":component2
    // }
  }
  init() {
    if (this.mode === "hash") {
      // 先判断用户打开时有没有hash值，没有的话跳转到#/
      location.hash ? "" : (location.hash = "/");
      window.addEventListener("load", () => {
        this.history.current = location.hash.slice(1);
      });
      window.addEventListener("hashchange", () => {
        this.history.current = location.hash.slice(1);
      });
    } else {
      location.pathname ? "" : (location.pathname = "/");
      window.addEventListener("load", () => {
        this.history.current = location.pathname;
      });
      window.addEventListener("popstate", () => {
        this.history.current = location.pathname;
      });
    }
  }
  createMap(routes) {
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component;
      return pre;
    }, {});
  }
}
VueRouter.install = function (v) {
  // router-view router-link this.$router this.$route 的实现
  Vue = v;
  console.log(v);
  Vue.mixin({
    beforeCreate() {
      console.log(this);
      if (this.$options && this.$options.router) {
        // 根节点
        this._root = this;
        this._router = this.$options.router;
        // 响应式 vueroute 会被渲染 会触发render this._router.history.current
        Vue.util.defineReactive(this, "vueroute", this._router.history);
      } else {
        // 子组件
        this._root = this.$parent && this.$parent._root;
      }
    },
  });
  Vue.component("router-view", {
    // 根据当前的path 匹配component
    render(h) {
      const current = this._self._root._router.history.current;
      const routeMap = this._self._root._router.routesMap;
      return h(routeMap[current] || null);
    },
  });
  Vue.component("router-link", {
    props: {
      to: String,
    },
    render(h) {
      const mode = his._self._root._router.mode;
      const to = mode === "hash" ? `#${this.to}` : this.to;
      return h("a", { attrs: { href: to } }, this.$slots.default);
    },
  });
};

export default VueRouter;
