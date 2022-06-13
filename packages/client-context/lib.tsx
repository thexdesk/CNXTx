import { useMemo } from "react";
import { useLocation } from "remix";
import invariant from "@remix-run/react/invariant";
import jsesc from "jsesc";
import Gun from "gun";
import { useDataLoader } from "./context";
import { useIf, useSafeCallback } from "bresnow_utility-react-hooks";
import { useGunStatic } from "~/lib/gun/hooks";
import React from "react";
import { Options } from "./browser";
export { DataloaderProvider } from "./context";
/**
 * @param {string} remix route path to load
 * @param {Options} options Redaxios options
 */
export interface DeferedData {
  load(): Record<string, any>;
  cached: unknown;
}

/**
 * Fetches route loaders for Suspended Components. Uses RAD/ indexedDB to load and store cached data.
 * @param routePath remix route path to load
 * @param options Redaxios options
 * @returns 
 */
export function useFetcherAsync<FetchedLoaderData>(
  routePath: string,
  options?: Options
): DeferedData {
  let dataloader = useDataLoader();
  let { key } = useLocation();
  let deferred = useMemo(() => {
    invariant(dataloader, "Context Provider is undefined for useGunFetcher");
    let _deferred = { resolved: false } as {
      resolved: boolean;
      cache?: unknown;
      value?: FetchedLoaderData;
      error?: any;
      promise: Promise<void>;
    };
    _deferred.promise = dataloader
      .load(routePath, options)
      .then(({ data, cache }) => ({ data, cache }))
      .then((value) => {
        _deferred.value = value.data;
        _deferred.cache = value.cache;
        _deferred.resolved = true;
      })
      .catch((error) => {
        _deferred.error = error;
        _deferred.resolved = true;
      });
    return _deferred;
  }, [routePath, key]);

  return {
    load(): FetchedLoaderData {
      if (typeof deferred.value !== "undefined") {
        return deferred.value;
      }
      if (typeof deferred.error !== "undefined") {
        throw deferred.error;
      }

      throw deferred.promise;
    },
    cached: deferred.cache,
  };
}
export const includes = (object: any, prop: string) => {
  if (typeof object !== "object") {
    return;
  }
  return Object.getOwnPropertyNames(object).includes(prop);
};
