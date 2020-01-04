// Type definitions for LubanRouter 0.0.1
// Project: https://github.com/front-end-captain/luban-router
// Definitions by: front-end-captain <https://github.com/front-end-captain>
// TypeScript Version: 3.6.3

import { ComponentType, LazyExoticComponent } from "react";
import { RouteComponentProps } from "react-router-dom";

type RouteMode = "browser" | "hash";
type HashType = "slash" | "noslash" | "hashbang";

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
   * @type {ComponentType<RouteComponentProps<any>> | ComponentType<any> | LazyExoticComponent<any>}
   * @default {} () => null;
   */
  component?:
    | ComponentType<RouteComponentProps<any>>
    | ComponentType<any>
    | LazyExoticComponent<any>;
  /**
   * @description roles that can access this route
   * @type {Array<string | number>}
   * @default {Array} []
   */
  authority?: Array<string | number>;
  /**
   * @description this route's icon
   * @type {string}
   */
  icon?: string;
}

export interface NestedRouteItem extends BasicRouterItem {
  /**
   * @description this route's child route
   */
  children?: Array<NestedRouteItem>;
}
