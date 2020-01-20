## Luban-router
基于 [react-router](https://reacttraining.com/react-router/web/guides/quick-start) 的并提供路由鉴权、菜单导航的配置式静态路由管理器。

> ⚠️ `luban-router` 创建的路由均为静态路由，所以若是有创建动态路由的需求，`luban-router` 并不适合。另外在路由配置中提到的【子路由】也是一个伪概念，只是表示一种菜单导航上的层级关系。在内部实现时，最终会将这种嵌套结构拍平。

### 如何使用

#### 安装
```shell
npm i luban-router --save
```

1. 添加配置
```tsx
// config.js
export default {
  routes: [
    {
      name: "首页",
      path: "/",
      component: Index,
      children: [
        {
          name: "列表",
          path: "/list",
          component: List,
        },
      ],
    },
    {
      name: "用户中心",
      path: "/user",
      component: User,
    },
    // path 为 404 的路由将作为整个应用的 404 回退页面
    {
      path: "404",
      component: NotFound,
    },
  ],
};
```

2. 在你的应用中使用 ` <LubanRouter /> `
```tsx
import React from "react";
import ReactDOM from "react-dom";
import { LubanRouter } from "luban-router";

import config from "./config.js";

const root = document.getElementById("root");
ReactDOM.render(<LubanRouter config={config} />, root);
```

### API

`<LubanRouter />` 接收三个参数，分别是：

+ `config` 路由配置项

  路由配置项是必选参数，间接的提现了整个应用的骨架关系，具体格式如下：

  ```typescript
  interface RouteConfig {
    /**
     * @description 路由模式，使用 "browser" 模式还是 "hash" 模式
     * @type {string}
     * @default {string} "browser"
     */
    mode?: RouteMode;
    /**
     * @description 路由路径前缀
     * @type {string}
     * @default {string} "/"
     */
    basename?: string;
    /**
     * @description "hash" 模式下的 hash 类型
     * @see https://reacttraining.com/react-router/web/api/HashRouter/hashtype-string
     *  Available values are:
     * + "slash" - Creates hashes like #/ and #/sunshine/lollipops
     * + "noslash" - Creates hashes like # and #sunshine/lollipops
     * + "hashbang" - Creates “ajax crawlable” (deprecated by Google) hashes like #!/ and #!/sunshine/lollipops
     *
     * @type {"slash" | "noslash" | "hashbang"}
     * @default {string} "slash"
     */
    hashType?: HashType;
    /**
     * @description 路由表配置项
     * @type {Array}
     */
    routes: Array<NestedRouteItem>;
  }
```
  
其中，字段 `routes` 的格式如下:
  
  ```typescript
  interface NestedRouteItem {
    /**
     * @description 路由名称
     * @type {string}
     * @default {string} ""
     */
    name?: string;
    /**
     * @description 路由路径
     * @type {string}
     */
    path: string;
    /**
     * @description 是否将 `location.pathname` 与当前路径严格匹配
     * @type {boolean}
     * @default {boolean} true
     */
    exact?: boolean;
    /**
     * @description "hash" 模式下，是否将当前的路径 hash 与 location.pathname 的 hash 严格匹配
     * @type {boolean}
     * @default {boolean} false
     */
    strict?: boolean;
    /**
     * @description 与 path 对应的组件
     * @type {ComponentType<any> | LazyExoticComponent<ComponentType<any>>}
     * @default {} () => null;
     */
     component?:
       | ComponentType<DefaultRouteProps>
       | LazyExoticComponent<ComponentType<DefaultRouteProps>>;
    /**
     * @description 可访问当前路由的角色集合
     * @type {Array<string | number>}
     * @default {Array} []
     */
    authority?: Array<string | number>;
    /**
     * @description 无权访问时的重定向路径
     * 如果此值缺省，404 路径将作为默认的重定向路径
     * @type {string | Function}
     */
    redirect?: string | ((role?: Role) => string);
    /**
     * @description 路由图标，在创建菜单导航时会用到
     * @type {string}
     */
    icon?: string;

    /**
     * @description 路由记录，将会挂载到对应的路由组件的 props 上
     */
    meta?: Record<string | number | symbol, any>;

    /**
     * @description 子路由
     */
    children?: Array<NestedRouteItem>;
  }
  ```

+ `role` 当前用户角色

  当前应用中用户的角色，可以是 number 或者 string，必须与 `RouteConfig.routes` 中的 `authority` 字段中的元素类型保持一致。该字段的类型如下：

  ```typescript
  type role = string | number | Array<string | number>;
  ```

  如果配置了该字段存在并且同时配置了`RouteConfig.routes` 中的 `authority` 字段，在创建应用路由表时，将对两者求交集来判断是否添加该路由。

+ `children` 渲染自定义内容的回调函数

  `luban-router` 默认只是创建应用路由表，并不带有任何页面布局方案。如果你想实现一些自定义的布局方案或者渲染一些自定义的内容，可以传递 `children` 参数来实现：

  ```jsx
  <LubanRouter config={config} role={getUserRole()}>
    {({ renderedTable, matchedRouteList, permissionRouteList }) => {
      return (
         <div>
         	// 渲染侧边栏导航
          // 渲染面包屑导航
          // ...
         </div>
      );
    }}
  </LubanRouter>
  ```
  
  其中，第一个参数是已经渲染好的路由表，第二个参数是与当前路径匹配的路由列表，第三个参数是当前角色可有权访问的路由表（这个路由表是嵌套结构的）。

