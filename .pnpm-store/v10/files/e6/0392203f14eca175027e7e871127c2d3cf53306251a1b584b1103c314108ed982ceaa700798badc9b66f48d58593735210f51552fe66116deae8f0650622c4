import defu from "defu";
import {
  appendResponseHeader,
  eventHandler,
  getHeader,
  proxyRequest,
  sendRedirect,
  setHeaders
} from "h3";
import { createRouter as createRadixRouter, toRouteMatcher } from "radix3";
import { getQuery, joinURL, withQuery, withoutBase } from "ufo";
import { useRuntimeConfig } from "./config.mjs";
const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRadixRouter({ routes: config.nitro.routeRules })
);
const goHeader = "x-nitro-go";
export function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    const goAhead = !!routeRules.headers?.[goHeader] || getHeader(event, goHeader);
    if (!goAhead) {
      if (routeRules.redirect) {
        let target = routeRules.redirect.to;
        if (target.endsWith("/**")) {
          let targetPath = event.path;
          const strpBase = routeRules.redirect._redirectStripBase;
          if (strpBase) {
            targetPath = withoutBase(targetPath, strpBase);
          }
          target = joinURL(target.slice(0, -3), targetPath);
        } else if (event.path.includes("?")) {
          const query = getQuery(event.path);
          target = withQuery(target, query);
        }
        appendResponseHeader(event, goHeader, "true");
        return sendRedirect(event, target, routeRules.redirect.statusCode);
      }
      if (routeRules.proxy) {
        let target = routeRules.proxy.to;
        if (target.endsWith("/**")) {
          let targetPath = event.path;
          const strpBase = routeRules.proxy._proxyStripBase;
          if (strpBase) {
            targetPath = withoutBase(targetPath, strpBase);
          }
          target = joinURL(target.slice(0, -3), targetPath);
        } else if (event.path.includes("?")) {
          const query = getQuery(event.path);
          target = withQuery(target, query);
        }
        return proxyRequest(event, target, {
          fetch: ctx.localFetch,
          headers: {
            [goHeader]: "true",
            ...routeRules.proxy.headers
          },
          ...routeRules.proxy
        });
      }
    }
  });
}
export function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
export function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}
