## Luban-router
> a configurable routing solution for react app

### use it

#### install
```shell
npm i luban-router --save
```

#### add config
```tsx
// config.tsx
import { RouterItem } from "luban-router";

const Index: FunctionComponent = () => (<div>index page</div>);
const User: FunctionComponent = () => (<div>user page</div>);

export const routes: Array<RouteItem> = [
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
];
```

#### use <LubanRouter /> in your app
```tsx
import React from "react";
import ReactDOM from "react-dom";
import { LubanRouter } from "luban-router";

import { routes } from "./config.tsx";

const App: FunctionComponent = () => {
  return <LubanRouter routes={routes} />;
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
```
