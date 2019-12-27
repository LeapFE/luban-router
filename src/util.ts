import { RouteItem } from "./table";

/**
 * 将嵌套结构的路由表转换为一维的路由列表
 *
 * @see router/config.ts
 */
function flattenRoutes(routes: Array<RouteItem>): Array<RouteItem> {
  let routeList: Array<RouteItem> = [];
  routes.forEach((route) => {
    routeList.push(route);
    if (Array.isArray(route.children) && route.children.length > 0) {
      routeList = routeList.concat(flattenRoutes(route.children));
    }
  });

  return routeList;
}

// eslint-disable-next-line import/prefer-default-export
export { flattenRoutes };
