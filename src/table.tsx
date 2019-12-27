import React, { ComponentType, ReactElement, FunctionComponent } from "react";
import { RouteComponentProps, Switch, Route } from "react-router-dom";

export interface RouteItem {
  name?: string;
  path: string;
  component?: ComponentType<RouteComponentProps<any>> | ComponentType<any>;
  authority?: string[];
  icon?: string;
  children?: Array<RouteItem>;
}

function createRouterTable(routes: Array<RouteItem>): Array<ReactElement> {
  const table: JSX.Element[] = [];

  const reversedRoutes: Array<RouteItem> = Array.from(routes).reverse();

  reversedRoutes.forEach((route) => {
    const { path, component: Component } = route;
    if (Component) {
      table.push(<Route key={path} extra path={path} component={Component} />);
    }
  });

  return table;
}

interface LubanRouterProps {
  routes: Array<RouteItem>;
}

const LubanRouter: FunctionComponent<LubanRouterProps> = ({ routes }) => (
  <Switch>{createRouterTable(routes)}</Switch>
);

export { LubanRouter };
