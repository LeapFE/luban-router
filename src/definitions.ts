// Type definitions for LubanRouter 1.0.0
// Project: https://github.com/LeapFE/luban-router
// Definitions by: front-end-captain <https://github.com/LeapFE>
// TypeScript Version: 3.7.4

import { ComponentType, LazyExoticComponent, ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";

export type RouteMetaData = Record<string | number | symbol, any>;

type DefaultRouteProps = { meta?: RouteMetaData } & RouteComponentProps<any>;
export type RouteComponent<P extends DefaultRouteProps = any> =
  | ComponentType<P>
  | LazyExoticComponent<ComponentType<P>>;

/**
 * @description uses the HTML5 history API or uses the hash portion of the URL
 */
export type RouteMode = "browser" | "hash";

/**
 * @description The type of encoding to use for window.location.hash.
 */
export type HashType = "slash" | "noslash" | "hashbang";

/**
 * @description user role of application
 */
export type Role = string | number | Array<string | number>;

export type Authority = Array<string | number>;

export interface RouteConfig {
  /**
   * @description uses the HTML5 history API or uses the hash portion of the URL
   * @type {string}
   * @default {string} "browser"
   */
  mode?: RouteMode;
  /**
   * @description The base URL for all locations.
   * @type {string}
   * @default {string} "/"
   */
  basename?: string;
  /**
   * @description The type of encoding to use for window.location.hash.
   * @see https://reacttraining.com/react-router/web/api/HashRouter/hashtype-string
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
   * @description route table config
   * @type {Array}
   */
  routes: Array<NestedRouteItem>;
}

export interface BasicRouterItem {
  /**
   * @description route name
   * @type {string}
   * @default {string} ""
   */
  name?: string;

  /**
   * @description route path
   * @type {string}
   */
  path: string;

  /**
   * @description redirect path
   * @type string
   */
  redirect?: string;

  /**
   * @description When true, will only match if the path matches the location.pathname exactly
   * @type {boolean}
   * @default {boolean} true
   */
  exact?: boolean;

  /**
   * @description When true, a path that has a trailing slash will only match a location.pathname with a trailing slash.
   * @type {boolean}
   * @default {boolean} false
   */
  strict?: boolean;

  /**
   * @description path to rendered view component
   * @type {ComponentType<RouteComponentProps<any>> | ComponentType<any>}
   * @default {} () => null;
   */
  component?: RouteComponent;

  /**
   * @description roles that can access this route
   * if this value is undefined, mean all role can access this route
   * if this value is empty array, mean any role can't access this route
   *
   * @type {Array<string | number>}
   * @default {Array} []
   */
  authority?: Authority;

  /**
   * @description redirect path when access no authority route
   * if this value is undefined, will redirect to 404 page when access route
   * @type {string | Function}
   */
  unAuthorityPath?: string | ((role: Role) => string);

  /**
   * @description this route's icon
   * @type {string}
   */
  icon?: string;

  /**
   * @description route meta data, will pass to route component props
   */
  meta?: Record<string | number | symbol, any>;
}

export interface NestedRouteItem extends BasicRouterItem {
  /**
   * @description this route's child route
   */
  children?: Array<NestedRouteItem>;
}

export interface MatchedRouterItem extends BasicRouterItem {
  active: boolean;
}

type customRendererParams = {
  /**
   * @description rendered router table, can use it directly
   */
  renderedTable: ReactElement<any>;
  /**
   * @description 与当前路径匹配的路由集合，可用于创建面包屑导航
   */
  matchedRouteList: Array<MatchedRouterItem>;
  /**
   * @description 当前角色可访问的路由列表(嵌套结构)
   */
  permissionRouteList: Array<NestedRouteItem>;
};

export interface CustomRenderer {
  (params: customRendererParams): ReactElement;
}

export interface CustomCheckAuthority {
  (role: Role, authority?: Authority | undefined): boolean;
}

export interface LubanRouterProps {
  // route config
  config: RouteConfig;
  // role of app
  role?: Role;
  // custom render callback. implement app layout、nav、breadcrumbs and so on
  children?: CustomRenderer;
  // custom authority checker
  customCheckAuthority?: CustomCheckAuthority;
}
