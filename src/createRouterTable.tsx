import React, { ReactElement, isValidElement, ComponentType } from "react";
import { Route, RouteComponentProps, Redirect } from "react-router-dom";

import { NestedRouteItem, Role } from "./definitions";

import { checkAuthority } from "./util";

function renderRouteComponent(
  route: NestedRouteItem,
  props: RouteComponentProps<any>,
  role?: Role,
): ReactElement {
  const { component: Component, authority, redirect, meta } = route;

  let redirectPath = "/404";

  if (typeof Component === "undefined") {
    return <Redirect to={redirectPath} />;
  }

  if (isValidElement(Component)) {
    return <Redirect to={redirectPath} />;
  }

  if (typeof role === "undefined") {
    return <Component {...props} meta={meta} />;
  }

  if (checkAuthority(role, authority)) {
    return <Component {...props} meta={meta} />;
  }

  if (typeof redirect === "string") {
    redirectPath = redirect;
  }
  if (typeof redirect === "function") {
    redirectPath = redirect(role);
  }
  return <Redirect to={redirectPath} />;
}

function createRouterTable(
  routes: Array<NestedRouteItem>,
  role?: Role,
  NotFound?: ComponentType<any>,
): Array<ReactElement> {
  const table: ReactElement[] = [];

  const reversedRoutes: Array<NestedRouteItem> = Array.from(routes).reverse();

  reversedRoutes.forEach((route) => {
    const { path, component: Component, exact = true, strict = true } = route;

    if (typeof Component === "undefined") {
      return;
    }

    if (isValidElement(Component)) {
      return;
    }

    if (route.path.includes("404")) {
      return;
    }

    const routeComponent = (
      <Route
        key={path}
        exact={exact}
        path={path}
        strict={strict}
        render={(props: RouteComponentProps): ReactElement => {
          return renderRouteComponent(route, props, role);
        }}
      />
    );

    table.push(routeComponent);
  });

  const notFoundRoute = <Route path="/404" key="/404" exact component={NotFound} />;
  table.unshift(notFoundRoute);

  const fallBackRoute = <Route path="*" key="*" component={NotFound} />;
  table.push(fallBackRoute);

  return table;
}

export { createRouterTable };
