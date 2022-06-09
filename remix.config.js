/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  customServer: "./app/server.ts",
  ignoredRouteFiles: [".*"],
  devServerBroadcastDelay: 1000,
  serverDependenciesToBundle: ["zx", "fsxx", "fs", "path", "zx/globals"],
};
