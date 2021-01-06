import React, { FunctionComponent, useMemo, Suspense, ReactNode, CSSProperties } from "react";
import { Switch, BrowserRouter, HashRouter, HashRouterProps, useLocation } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";

import { flattenRoutes, filterUnPermissionRoute } from "./util";
import { createRouterTable } from "./createRouterTable";
import { DefaultNotFound } from "./defaultNotfound";

import {
  NestedRouteItem,
  LubanRouterProps,
  RouteComponent,
  BasicRouterItem,
  Role,
  MatchedRouterItem,
  CustomCheckAuthority,
} from "./definitions";

const suspenseFallbackStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.4rem",
  color: "#ccc",
};

const defaultFallback = <span style={suspenseFallbackStyle}>loading...</span>;

function useMatchedRouteList(routeList: Array<BasicRouterItem>): Array<MatchedRouterItem> {
  const { pathname } = useLocation();

  let pathSnippets = pathname.split("/").filter((p) => !!p);

  if (pathname !== "/") {
    pathSnippets = pathname.split("/").filter((i) => i);
  }

  const matchedRouteList: Array<MatchedRouterItem> = [];

  pathSnippets.forEach((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    const targetRoute = routeList.find((route) => {
      return pathToRegexp(route.path, [], { strict: false }).test(url);
    });

    if (targetRoute) {
      matchedRouteList.push({
        name: targetRoute.name,
        path: targetRoute.path,
        active: pathname === url,
      });
    }
  });

  return matchedRouteList;
}

function findNotFoundComponent(
  routes: Array<NestedRouteItem>,
  defaultNotFound: RouteComponent,
): RouteComponent {
  const notFoundRouteItem = routes.find((route) => route.path.includes("404"));

  if (notFoundRouteItem === undefined) {
    return defaultNotFound;
  }

  if (notFoundRouteItem.component === undefined) {
    return defaultNotFound;
  }

  return notFoundRouteItem.component;
}

interface RouterTableProps {
  flattenRouteList: Array<BasicRouterItem>;
  routeList: Array<NestedRouteItem>;
  notFoundComponent: RouteComponent;
  fallback: NonNullable<ReactNode> | null;
  role?: Role;
  customRender?: LubanRouterProps["children"];
  customCheckAuthority?: CustomCheckAuthority;
}
const RouterTable: FunctionComponent<RouterTableProps> = ({
  flattenRouteList,
  routeList,
  notFoundComponent,
  role,
  customRender,
  customCheckAuthority,
  fallback,
}) => {
  const routerTable = createRouterTable(flattenRouteList, {
    role,
    NotFound: notFoundComponent,
    customCheckAuthority,
  });

  const matchedRouteList = useMatchedRouteList(flattenRouteList);

  let appRouter = (
    <Suspense fallback={fallback}>
      <Switch>{routerTable}</Switch>
    </Suspense>
  );

  let permissionRouteList: Array<NestedRouteItem> = routeList;
  if (role) {
    permissionRouteList = filterUnPermissionRoute(routeList, role);
  }

  if (typeof customRender === "function") {
    appRouter = customRender({
      renderedTable: <Switch>{routerTable}</Switch>,
      matchedRouteList,
      permissionRouteList,
    });
  }

  return appRouter;
};

const LubanRouter: FunctionComponent<LubanRouterProps> = ({
  config,
  role,
  children,
  customCheckAuthority,
  fallback = defaultFallback,
}) => {
  const { routes, mode = "browser", basename = "/", hashType = "slash" } = config;

  const flattenRouteList = useMemo(() => flattenRoutes(routes), [routes]);

  const notFoundComponent: RouteComponent = findNotFoundComponent(routes, DefaultNotFound);

  const hashRouterProps: HashRouterProps = { hashType, basename };

  const RouteTableProps: RouterTableProps = {
    routeList: routes,
    customRender: children,
    flattenRouteList,
    role,
    notFoundComponent,
    customCheckAuthority,
    fallback,
  };

  return mode === "browser" ? (
    <BrowserRouter basename={basename}>
      <RouterTable {...RouteTableProps} />
    </BrowserRouter>
  ) : (
    <HashRouter {...hashRouterProps}>
      <RouterTable {...RouteTableProps} />
    </HashRouter>
  );
};

export { LubanRouter };
