import React, { ReactElement, FunctionComponent, useMemo, Suspense } from "react";
import { Switch, BrowserRouter, HashRouter } from "react-router-dom";

import { RouteConfig, BasicRouterItem } from "./definitions";

import { flattenRoutes } from "./util";

import { createRouterTable } from "./createRouterTable";

interface LubanRouterProps {
  config: RouteConfig;
  role?: string | number | Array<string | number>;
  notFound?: ReactElement;
  children?: (table: ReactElement, routes: Array<BasicRouterItem>) => ReactElement;
}

const LubanRouter: FunctionComponent<LubanRouterProps> = ({ config, role, children, notFound }) => {
  const { routes, mode = "browser", basename = "/", hashType = "slash" } = config;

  const flattenRouteList = useMemo(() => flattenRoutes(routes), [routes]);

  const renderRouter =
    mode === "browser"
      ? (child: ReactElement): ReactElement => (
          <BrowserRouter basename={basename}>{child}</BrowserRouter>
        )
      : (child: ReactElement): ReactElement => (
          <HashRouter hashType={hashType} basename={basename}>
            {child}
          </HashRouter>
        );

  let routerTable = (
    <Suspense fallback={<span>loading</span>}>
      <Switch>{createRouterTable(flattenRouteList, role, notFound)}</Switch>
    </Suspense>
  );

  if (typeof children === "function") {
    routerTable = children(
      <Switch>{createRouterTable(flattenRouteList, role, notFound)}</Switch>,
      flattenRouteList,
    );
  }

  return renderRouter(routerTable);
};

export { LubanRouter };
