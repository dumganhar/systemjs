import { REGISTRY, systemJSPrototype } from './system-core.js';
import { IMPORT_MAP, IMPORT_MAP_PROMISE } from './features/import-map.js';
import './features/registry.js';
import './extras/global.js';
import './extras/module-types.js';
import './features/node-fetch.js';
import { BASE_URL, baseUrl, resolveAndComposeImportMap } from './common.js';

export const System = global.System;

const originalResolve = systemJSPrototype.resolve;
systemJSPrototype.resolve = function () {
  if (!this[IMPORT_MAP]) {
    // Allow for basic URL resolution before applyImportMap is called
    this[IMPORT_MAP] = { imports: {}, scopes: {} };
  }
  return originalResolve.apply(this, arguments);
};

export function applyImportMap(loader, newMap, mapBase) {
  ensureValidSystemLoader(loader);
  loader[IMPORT_MAP] = resolveAndComposeImportMap(newMap, mapBase || baseUrl, loader[IMPORT_MAP] || { imports: {}, scopes: {} });
  loader[IMPORT_MAP_PROMISE] = Promise.resolve();
}

export { clearFetchCache } from './features/node-fetch.js';

export function setBaseUrl(loader, url) {
  ensureValidSystemLoader(loader);
  loader[BASE_URL] = new URL(url).href;
}

function ensureValidSystemLoader (loader) {
  if (!loader[REGISTRY])
    throw new Error('A valid SystemJS instance must be provided');
}
