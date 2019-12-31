import { NestedRouteItem, BasicRouterItem } from "./definitions";

/**
 * 将嵌套结构的路由表转换为一维的路由列表
 *
 * @see router/config.ts
 */
function flattenRoutes(routes: Array<NestedRouteItem>): Array<BasicRouterItem> {
  let routeList: Array<BasicRouterItem> = [];
  routes.forEach((route) => {
    routeList.push(route);
    if (Array.isArray(route.children) && route.children.length > 0) {
      routeList = routeList.concat(flattenRoutes(route.children));
    }
  });

  return routeList;
}

export { flattenRoutes };
