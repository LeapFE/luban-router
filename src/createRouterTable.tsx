import React, { ReactElement, isValidElement, createElement } from "react";
import { Route, RouteComponentProps, Redirect, RedirectProps } from "react-router-dom";

import { NestedRouteItem, Role, CustomCheckAuthority, RouteComponent } from "./definitions";

import { checkAuthority } from "./util";

function generateRedirectRouteProps(
  route: NestedRouteItem,
  defaultUnAuthorityPath: string,
): RedirectProps & { key: string } {
  const { component: Component, redirect, path, exact, strict } = route;

  let toPath = redirect || defaultUnAuthorityPath;
  let routeKey = `${path}-${redirect}`;

  if (Component === undefined && redirect === undefined) {
    toPath = defaultUnAuthorityPath;
    routeKey = `${path}-${defaultUnAuthorityPath}`;
  }

  return {
    key: routeKey,
    to: toPath,
    exact,
    strict,
    from: path,
  };
}

function renderRouteComponent(
  route: NestedRouteItem,
  props: RouteComponentProps,
  authorityChecker: CustomCheckAuthority,
  role?: Role,
): ReactElement {
  const { component: Component, authority, unAuthorityPath, meta, redirect, path } = route;

  let defaultUnAuthorityPath = "/404";

  if (typeof role === "undefined") {
    if (Component === undefined || typeof redirect === "string") {
      return <Redirect {...generateRedirectRouteProps(route, defaultUnAuthorityPath)} />;
    }

    return <Component {...props} meta={meta} />;
  }

  if (authorityChecker(role, authority)) {
    if (Component === undefined || typeof redirect === "string") {
      return <Redirect {...generateRedirectRouteProps(route, defaultUnAuthorityPath)} />;
    }

    return <Component {...props} meta={meta} />;
  }

  if (typeof unAuthorityPath === "string") {
    defaultUnAuthorityPath = unAuthorityPath;
  }

  if (typeof unAuthorityPath === "function") {
    defaultUnAuthorityPath = unAuthorityPath(role);
  }

  return (
    <Redirect key={`${path}-${defaultUnAuthorityPath}`} from={path} to={defaultUnAuthorityPath} />
  );
}

type createRouterTableOptions = {
  role?: Role;
  NotFound?: RouteComponent;
  customCheckAuthority?: CustomCheckAuthority;
};

function createRouterTable(
  routes: Array<NestedRouteItem>,
  options: createRouterTableOptions,
): Array<ReactElement> {
  const { role, NotFound, customCheckAuthority } = options;

  const table: ReactElement[] = [];

  const reversedRoutes: Array<NestedRouteItem> = Array.from(routes).reverse();

  const authorityChecker =
    typeof customCheckAuthority === "function" ? customCheckAuthority : checkAuthority;

  reversedRoutes.forEach((route) => {
    const { path, component: Component, exact = true, strict = true } = route;

    // Component is not undefined, check it valid element
    if (Component !== undefined) {
      if (!isValidElement(createElement(Component, null))) {
        console.error(`path ${path} mapping component is not a valid React Element`);
        return;
      }
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
          return renderRouteComponent(route, props, authorityChecker, role);
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
