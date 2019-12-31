import React, { ReactElement, FunctionComponent, useMemo, ComponentType } from "react";
import { Switch, BrowserRouter, HashRouter } from "react-router-dom";

import { RouteConfig, BasicRouterItem } from "./definitions";

import { flattenRoutes } from "./util";

import { createRouterTable } from "./createRouterTable";

interface LubanRouterProps {
  config: RouteConfig;
  role?: string | number | Array<string | number>;
  customRender?: (table: ReactElement, routes: Array<BasicRouterItem>) => ReactElement;
  notFound?: ComponentType<any>;
}

const LubanRouter: FunctionComponent<LubanRouterProps> = ({
  config,
  customRender,
  role,
  notFound,
}) => {
  const { routes, mode = "browser", basename = "/", hashType = "slash" } = config;

  const flattenRouteList = useMemo(() => flattenRoutes(routes), [routes]);

  const renderRouter =
    mode === "browser"
      ? (children: ReactElement) => <BrowserRouter basename={basename}>{children}</BrowserRouter>
      : (children: ReactElement) => (
          <HashRouter hashType={hashType} basename={basename}>
            {children}
          </HashRouter>
        );

  if (typeof customRender === "function") {
    return renderRouter(
      customRender(
        <Switch>{createRouterTable(flattenRouteList, role, notFound)}</Switch>,
        flattenRouteList,
      ),
    );
  }

  return renderRouter(<Switch>{createRouterTable(flattenRouteList, role, notFound)}</Switch>);
};

export { LubanRouter };
