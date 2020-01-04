## Luban-router
> 基于 [react-router](https://reacttraining.com/react-router/web/guides/quick-start) 的并提供路由鉴权、菜单导航的配置式路由管理器。

### 如何使用

#### 安装
```shell
npm i luban-router --save
```

1. 添加配置
```tsx
// config.tsx
import { RouteConfig } from "luban-router";

const Index: FunctionComponent = () => (<div>index page</div>);
const User: FunctionComponent = () => (<div>user page</div>);

export const config: RouteConfig = {
  routes: [
    {
      name: "首页",
      path: "/",
      component: Index,
    },
    {
      name: "用户中心",
      path: "/user",
      component: User,
    },
  ],
};
```

2. 在你的应用中使用 ` <LubanRouter /> `
```tsx
import React from "react";
import ReactDOM from "react-dom";
import { LubanRouter } from "luban-router";

import { config } from "./config.tsx";

const App: FunctionComponent = () => {
  return <LubanRouter config={config} />;
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
```

### API

`<LubanRouter>` 接收四个参数，分别是：

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
     * @type {ComponentType<RouteComponentProps<any>> | ComponentType<any>}
     * @default {} () => null;
     */
     component?:
      | ComponentType<RouteComponentProps<any>>
      | ComponentType<any>
      | LazyExoticComponent<any>;
    /**
     * @description 可访问当前路由的角色集合
     * @type {Array<string | number>}
     * @default {Array} []
     */
    authority?: Array<string | number>;
    /**
     * @description 路由图标，在创建菜单导航时会用到
     * @type {string}
     */
    icon?: string;
    /**
     * @description 子路由
     */
    children?: Array<NestedRouteItem>;
  }
  ```

+ `role` 当前用户角色

  当前应用中用户的角色，可以是数字或者 string，必须与 `RouteConfig.routes` 中的 `authority` 字段中的元素类型保持一致。该字段的类型如下：

  ```typescript
  type role = string | number | Array<string | number> | undefined;
  ```

  如果配置了该字段存在并且同时配置了`RouteConfig.routes` 中的 `authority` 字段，在创建应用路由表时，将对两者求交集来判断是否添加该路由。

+ `notFound` 404 组件

  路径无法匹配时渲染的组件:

  ```typescript
  type notFound = ReactElement | undefined;
  ```

+ `children` 渲染自定义布局的回调函数

  `<LubanRouter>` 接收一个 `children` 参数来渲染一些自定义的内容:

  ```typescript
  type children = (table: ReactElement, routes: Array<BasicRouterItem>) => ReactElement;
  ```

  其中，第一个参数是已经渲染好的路由表，第二个参数是扁平后的路由配置表。

