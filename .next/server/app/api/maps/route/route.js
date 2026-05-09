"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/maps/route/route";
exports.ids = ["app/api/maps/route/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmaps%2Froute%2Froute&page=%2Fapi%2Fmaps%2Froute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmaps%2Froute%2Froute.ts&appDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmaps%2Froute%2Froute&page=%2Fapi%2Fmaps%2Froute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmaps%2Froute%2Froute.ts&appDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_nefgt_Documents_Next_sitrip_src_app_api_maps_route_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/maps/route/route.ts */ \"(rsc)/./src/app/api/maps/route/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/maps/route/route\",\n        pathname: \"/api/maps/route\",\n        filename: \"route\",\n        bundlePath: \"app/api/maps/route/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\nefgt\\\\Documents\\\\Next\\\\sitrip\\\\src\\\\app\\\\api\\\\maps\\\\route\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_nefgt_Documents_Next_sitrip_src_app_api_maps_route_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/maps/route/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZtYXBzJTJGcm91dGUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRm1hcHMlMkZyb3V0ZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRm1hcHMlMkZyb3V0ZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNuZWZndCU1Q0RvY3VtZW50cyU1Q05leHQlNUNzaXRyaXAlNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q25lZmd0JTVDRG9jdW1lbnRzJTVDTmV4dCU1Q3NpdHJpcCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDK0I7QUFDNUc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXRyaXAvPzVhY2MiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcbmVmZ3RcXFxcRG9jdW1lbnRzXFxcXE5leHRcXFxcc2l0cmlwXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXG1hcHNcXFxccm91dGVcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL21hcHMvcm91dGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9tYXBzL3JvdXRlXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9tYXBzL3JvdXRlL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcbmVmZ3RcXFxcRG9jdW1lbnRzXFxcXE5leHRcXFxcc2l0cmlwXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXG1hcHNcXFxccm91dGVcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL21hcHMvcm91dGUvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmaps%2Froute%2Froute&page=%2Fapi%2Fmaps%2Froute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmaps%2Froute%2Froute.ts&appDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/maps/route/route.ts":
/*!*****************************************!*\
  !*** ./src/app/api/maps/route/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_maps__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/maps */ \"(rsc)/./src/lib/maps.ts\");\n\n\n\nasync function GET(req) {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getSession)();\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"No autorizado\"\n    }, {\n        status: 401\n    });\n    const { searchParams } = new URL(req.url);\n    const fromLat = parseFloat(searchParams.get(\"fromLat\") ?? \"\");\n    const fromLng = parseFloat(searchParams.get(\"fromLng\") ?? \"\");\n    const toLat = parseFloat(searchParams.get(\"toLat\") ?? \"\");\n    const toLng = parseFloat(searchParams.get(\"toLng\") ?? \"\");\n    if ([\n        fromLat,\n        fromLng,\n        toLat,\n        toLng\n    ].some(isNaN)) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Coordenadas inv\\xe1lidas\"\n        }, {\n            status: 400\n        });\n    }\n    const result = await (0,_lib_maps__WEBPACK_IMPORTED_MODULE_2__.calculateRouteSegment)(fromLat, fromLng, toLat, toLng);\n    if (!result) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"No se pudo calcular la ruta\"\n        }, {\n            status: 500\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        distanceKm: result.distanceKm,\n        durationMinutes: result.durationMinutes,\n        tollMXN: result.tollCostMXN\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9tYXBzL3JvdXRlL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMkM7QUFDSDtBQUNXO0FBRTVDLGVBQWVHLElBQUlDLEdBQVk7SUFDcEMsTUFBTUMsVUFBVSxNQUFNSixxREFBVUE7SUFDaEMsSUFBSSxDQUFDSSxTQUFTLE9BQU9MLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7UUFBRUMsT0FBTztJQUFnQixHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUVqRixNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlOLElBQUlPLEdBQUc7SUFDeEMsTUFBTUMsVUFBVUMsV0FBV0osYUFBYUssR0FBRyxDQUFDLGNBQWM7SUFDMUQsTUFBTUMsVUFBVUYsV0FBV0osYUFBYUssR0FBRyxDQUFDLGNBQWM7SUFDMUQsTUFBTUUsUUFBUUgsV0FBV0osYUFBYUssR0FBRyxDQUFDLFlBQVk7SUFDdEQsTUFBTUcsUUFBUUosV0FBV0osYUFBYUssR0FBRyxDQUFDLFlBQVk7SUFFdEQsSUFBSTtRQUFDRjtRQUFTRztRQUFTQztRQUFPQztLQUFNLENBQUNDLElBQUksQ0FBQ0MsUUFBUTtRQUNoRCxPQUFPbkIscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXdCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQzdFO0lBRUEsTUFBTVksU0FBUyxNQUFNbEIsZ0VBQXFCQSxDQUFDVSxTQUFTRyxTQUFTQyxPQUFPQztJQUNwRSxJQUFJLENBQUNHLFFBQVE7UUFDWCxPQUFPcEIscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQThCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ25GO0lBRUEsT0FBT1IscURBQVlBLENBQUNNLElBQUksQ0FBQztRQUN2QmUsWUFBWUQsT0FBT0MsVUFBVTtRQUM3QkMsaUJBQWlCRixPQUFPRSxlQUFlO1FBQ3ZDQyxTQUFTSCxPQUFPSSxXQUFXO0lBQzdCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXRyaXAvLi9zcmMvYXBwL2FwaS9tYXBzL3JvdXRlL3JvdXRlLnRzPzkxNTYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5pbXBvcnQgeyBnZXRTZXNzaW9uIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcbmltcG9ydCB7IGNhbGN1bGF0ZVJvdXRlU2VnbWVudCB9IGZyb20gXCJAL2xpYi9tYXBzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxOiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uKCk7XG4gIGlmICghc2Vzc2lvbikgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiTm8gYXV0b3JpemFkb1wiIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG5cbiAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxLnVybCk7XG4gIGNvbnN0IGZyb21MYXQgPSBwYXJzZUZsb2F0KHNlYXJjaFBhcmFtcy5nZXQoXCJmcm9tTGF0XCIpID8/IFwiXCIpO1xuICBjb25zdCBmcm9tTG5nID0gcGFyc2VGbG9hdChzZWFyY2hQYXJhbXMuZ2V0KFwiZnJvbUxuZ1wiKSA/PyBcIlwiKTtcbiAgY29uc3QgdG9MYXQgPSBwYXJzZUZsb2F0KHNlYXJjaFBhcmFtcy5nZXQoXCJ0b0xhdFwiKSA/PyBcIlwiKTtcbiAgY29uc3QgdG9MbmcgPSBwYXJzZUZsb2F0KHNlYXJjaFBhcmFtcy5nZXQoXCJ0b0xuZ1wiKSA/PyBcIlwiKTtcblxuICBpZiAoW2Zyb21MYXQsIGZyb21MbmcsIHRvTGF0LCB0b0xuZ10uc29tZShpc05hTikpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJDb29yZGVuYWRhcyBpbnbDoWxpZGFzXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbGN1bGF0ZVJvdXRlU2VnbWVudChmcm9tTGF0LCBmcm9tTG5nLCB0b0xhdCwgdG9MbmcpO1xuICBpZiAoIXJlc3VsdCkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk5vIHNlIHB1ZG8gY2FsY3VsYXIgbGEgcnV0YVwiIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgIGRpc3RhbmNlS206IHJlc3VsdC5kaXN0YW5jZUttLFxuICAgIGR1cmF0aW9uTWludXRlczogcmVzdWx0LmR1cmF0aW9uTWludXRlcyxcbiAgICB0b2xsTVhOOiByZXN1bHQudG9sbENvc3RNWE4sXG4gIH0pO1xufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldFNlc3Npb24iLCJjYWxjdWxhdGVSb3V0ZVNlZ21lbnQiLCJHRVQiLCJyZXEiLCJzZXNzaW9uIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwiZnJvbUxhdCIsInBhcnNlRmxvYXQiLCJnZXQiLCJmcm9tTG5nIiwidG9MYXQiLCJ0b0xuZyIsInNvbWUiLCJpc05hTiIsInJlc3VsdCIsImRpc3RhbmNlS20iLCJkdXJhdGlvbk1pbnV0ZXMiLCJ0b2xsTVhOIiwidG9sbENvc3RNWE4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/maps/route/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   getSession: () => (/* binding */ getSession)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\n\nconst THIRTY_DAYS = 30 * 24 * 60 * 60; // segundos\nconst authOptions = {\n    session: {\n        strategy: \"jwt\",\n        maxAge: THIRTY_DAYS,\n        updateAge: 24 * 60 * 60\n    },\n    cookies: {\n        sessionToken: {\n            name: \"next-auth.session-token\",\n            options: {\n                httpOnly: true,\n                sameSite: \"lax\",\n                path: \"/\",\n                secure: \"development\" === \"production\",\n                maxAge: THIRTY_DAYS\n            }\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Contrase\\xf1a\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                const user = await _prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    },\n                    include: {\n                        vehicle: true\n                    }\n                });\n                if (!user) return null;\n                const isValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_2___default().compare(credentials.password, user.password);\n                if (!isValid) return null;\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    role: user.role,\n                    phone: user.phone,\n                    avatar: user.avatar\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.role = user.role;\n                token.phone = user.phone;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token && session.user) {\n                session.user.id = token.id;\n                session.user.role = token.role;\n                session.user.phone = token.phone;\n            }\n            return session;\n        }\n    }\n};\nconst getSession = ()=>(0,next_auth__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(authOptions);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBOEQ7QUFDSTtBQUNwQztBQUNJO0FBRWxDLE1BQU1JLGNBQWMsS0FBSyxLQUFLLEtBQUssSUFBSSxXQUFXO0FBRTNDLE1BQU1DLGNBQStCO0lBQzFDQyxTQUFTO1FBQ1BDLFVBQVU7UUFDVkMsUUFBUUo7UUFDUkssV0FBVyxLQUFLLEtBQUs7SUFDdkI7SUFDQUMsU0FBUztRQUNQQyxjQUFjO1lBQ1pDLE1BQU07WUFDTkMsU0FBUztnQkFDUEMsVUFBVTtnQkFDVkMsVUFBVTtnQkFDVkMsTUFBTTtnQkFDTkMsUUFBUUMsa0JBQXlCO2dCQUNqQ1YsUUFBUUo7WUFDVjtRQUNGO0lBQ0Y7SUFDQWUsT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUMsV0FBVztRQUNUcEIsMkVBQW1CQSxDQUFDO1lBQ2xCVyxNQUFNO1lBQ05VLGFBQWE7Z0JBQ1hDLE9BQU87b0JBQUVDLE9BQU87b0JBQVNDLE1BQU07Z0JBQVE7Z0JBQ3ZDQyxVQUFVO29CQUFFRixPQUFPO29CQUFjQyxNQUFNO2dCQUFXO1lBQ3BEO1lBQ0EsTUFBTUUsV0FBVUwsV0FBVztnQkFDekIsSUFBSSxDQUFDQSxhQUFhQyxTQUFTLENBQUNELGFBQWFJLFVBQVUsT0FBTztnQkFFMUQsTUFBTUUsT0FBTyxNQUFNekIsMkNBQU1BLENBQUN5QixJQUFJLENBQUNDLFVBQVUsQ0FBQztvQkFDeENDLE9BQU87d0JBQUVQLE9BQU9ELFlBQVlDLEtBQUs7b0JBQUM7b0JBQ2xDUSxTQUFTO3dCQUFFQyxTQUFTO29CQUFLO2dCQUMzQjtnQkFFQSxJQUFJLENBQUNKLE1BQU0sT0FBTztnQkFFbEIsTUFBTUssVUFBVSxNQUFNL0IsdURBQWMsQ0FBQ29CLFlBQVlJLFFBQVEsRUFBRUUsS0FBS0YsUUFBUTtnQkFDeEUsSUFBSSxDQUFDTyxTQUFTLE9BQU87Z0JBRXJCLE9BQU87b0JBQ0xFLElBQUlQLEtBQUtPLEVBQUU7b0JBQ1h2QixNQUFNZ0IsS0FBS2hCLElBQUk7b0JBQ2ZXLE9BQU9LLEtBQUtMLEtBQUs7b0JBQ2pCYSxNQUFNUixLQUFLUSxJQUFJO29CQUNmQyxPQUFPVCxLQUFLUyxLQUFLO29CQUNqQkMsUUFBUVYsS0FBS1UsTUFBTTtnQkFDckI7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFYixJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUmEsTUFBTU4sRUFBRSxHQUFHUCxLQUFLTyxFQUFFO2dCQUNsQk0sTUFBTUwsSUFBSSxHQUFHLEtBQWNBLElBQUk7Z0JBQy9CSyxNQUFNSixLQUFLLEdBQUcsS0FBY0EsS0FBSztZQUNuQztZQUNBLE9BQU9JO1FBQ1Q7UUFDQSxNQUFNbkMsU0FBUSxFQUFFQSxPQUFPLEVBQUVtQyxLQUFLLEVBQUU7WUFDOUIsSUFBSUEsU0FBU25DLFFBQVFzQixJQUFJLEVBQUU7Z0JBQ3pCdEIsUUFBUXNCLElBQUksQ0FBQ08sRUFBRSxHQUFHTSxNQUFNTixFQUFFO2dCQUMxQjdCLFFBQVFzQixJQUFJLENBQUNRLElBQUksR0FBR0ssTUFBTUwsSUFBSTtnQkFDOUI5QixRQUFRc0IsSUFBSSxDQUFDUyxLQUFLLEdBQUdJLE1BQU1KLEtBQUs7WUFDbEM7WUFDQSxPQUFPL0I7UUFDVDtJQUNGO0FBQ0YsRUFBRTtBQUVLLE1BQU1vQyxhQUFhLElBQU0xQywyREFBZ0JBLENBQUNLLGFBQWEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXRyaXAvLi9zcmMvbGliL2F1dGgudHM/NjY5MiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMsIGdldFNlcnZlclNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiO1xuaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCIuL3ByaXNtYVwiO1xuXG5jb25zdCBUSElSVFlfREFZUyA9IDMwICogMjQgKiA2MCAqIDYwOyAvLyBzZWd1bmRvc1xuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxuICAgIG1heEFnZTogVEhJUlRZX0RBWVMsXG4gICAgdXBkYXRlQWdlOiAyNCAqIDYwICogNjAsIC8vIHJlbnVldmEgbGEgc2VzacOzbiBzaSB0aWVuZSBtw6FzIGRlIDEgZMOtYVxuICB9LFxuICBjb29raWVzOiB7XG4gICAgc2Vzc2lvblRva2VuOiB7XG4gICAgICBuYW1lOiBcIm5leHQtYXV0aC5zZXNzaW9uLXRva2VuXCIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgICAgICBzYW1lU2l0ZTogXCJsYXhcIixcbiAgICAgICAgcGF0aDogXCIvXCIsXG4gICAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiLFxuICAgICAgICBtYXhBZ2U6IFRISVJUWV9EQVlTLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogXCIvbG9naW5cIixcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBuYW1lOiBcImNyZWRlbnRpYWxzXCIsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJFbWFpbFwiLCB0eXBlOiBcImVtYWlsXCIgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiQ29udHJhc2XDsWFcIiwgdHlwZTogXCJwYXNzd29yZFwiIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZTogeyBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwgfSxcbiAgICAgICAgICBpbmNsdWRlOiB7IHZlaGljbGU6IHRydWUgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF1c2VyKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xuICAgICAgICBpZiAoIWlzVmFsaWQpIHJldHVybiBudWxsO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgICBwaG9uZTogdXNlci5waG9uZSxcbiAgICAgICAgICBhdmF0YXI6IHVzZXIuYXZhdGFyLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgY2FsbGJhY2tzOiB7XG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgdG9rZW4uaWQgPSB1c2VyLmlkO1xuICAgICAgICB0b2tlbi5yb2xlID0gKHVzZXIgYXMgYW55KS5yb2xlO1xuICAgICAgICB0b2tlbi5waG9uZSA9ICh1c2VyIGFzIGFueSkucGhvbmU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9rZW47XG4gICAgfSxcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xuICAgICAgaWYgKHRva2VuICYmIHNlc3Npb24udXNlcikge1xuICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5pZCBhcyBzdHJpbmc7XG4gICAgICAgIHNlc3Npb24udXNlci5yb2xlID0gdG9rZW4ucm9sZSBhcyBzdHJpbmc7XG4gICAgICAgIHNlc3Npb24udXNlci5waG9uZSA9IHRva2VuLnBob25lIGFzIHN0cmluZztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2Vzc2lvbiA9ICgpID0+IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuIl0sIm5hbWVzIjpbImdldFNlcnZlclNlc3Npb24iLCJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiYmNyeXB0IiwicHJpc21hIiwiVEhJUlRZX0RBWVMiLCJhdXRoT3B0aW9ucyIsInNlc3Npb24iLCJzdHJhdGVneSIsIm1heEFnZSIsInVwZGF0ZUFnZSIsImNvb2tpZXMiLCJzZXNzaW9uVG9rZW4iLCJuYW1lIiwib3B0aW9ucyIsImh0dHBPbmx5Iiwic2FtZVNpdGUiLCJwYXRoIiwic2VjdXJlIiwicHJvY2VzcyIsInBhZ2VzIiwic2lnbkluIiwicHJvdmlkZXJzIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImluY2x1ZGUiLCJ2ZWhpY2xlIiwiaXNWYWxpZCIsImNvbXBhcmUiLCJpZCIsInJvbGUiLCJwaG9uZSIsImF2YXRhciIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwiZ2V0U2Vzc2lvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/maps.ts":
/*!*************************!*\
  !*** ./src/lib/maps.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   calculateFuelCost: () => (/* binding */ calculateFuelCost),\n/* harmony export */   calculateRouteSegment: () => (/* binding */ calculateRouteSegment),\n/* harmony export */   formatDistance: () => (/* binding */ formatDistance),\n/* harmony export */   formatDuration: () => (/* binding */ formatDuration)\n/* harmony export */ });\nasync function calculateRouteSegment(originLat, originLng, destLat, destLng) {\n    const apiKey = \"AIzaSyD9N0EewAs62btDZGc4uhVJ22JVk8-M75k\";\n    if (!apiKey) return null;\n    try {\n        const res = await fetch(\"https://routes.googleapis.com/directions/v2:computeRoutes\", {\n            method: \"POST\",\n            headers: {\n                \"Content-Type\": \"application/json\",\n                \"X-Goog-Api-Key\": apiKey,\n                \"X-Goog-FieldMask\": \"routes.distanceMeters,routes.duration,routes.travelAdvisory.tollInfo\"\n            },\n            body: JSON.stringify({\n                origin: {\n                    location: {\n                        latLng: {\n                            latitude: originLat,\n                            longitude: originLng\n                        }\n                    }\n                },\n                destination: {\n                    location: {\n                        latLng: {\n                            latitude: destLat,\n                            longitude: destLng\n                        }\n                    }\n                },\n                travelMode: \"DRIVE\",\n                extraComputations: [\n                    \"TOLLS\"\n                ],\n                routeModifiers: {\n                    vehicleInfo: {\n                        emissionType: \"GASOLINE\"\n                    }\n                }\n            })\n        });\n        if (!res.ok) return null;\n        const data = await res.json();\n        const route = data.routes?.[0];\n        if (!route) return null;\n        const tollPrices = route.travelAdvisory?.tollInfo?.estimatedPrice;\n        const mxnToll = tollPrices?.find((p)=>p.currencyCode === \"MXN\");\n        const tollCostMXN = mxnToll ? parseFloat(mxnToll.units || \"0\") + (mxnToll.nanos || 0) / 1e9 : null;\n        const distanceMeters = route.distanceMeters ?? 0;\n        const durationSeconds = parseInt((route.duration ?? \"0s\").replace(\"s\", \"\"), 10);\n        return {\n            distanceMeters,\n            distanceKm: distanceMeters / 1000,\n            durationSeconds,\n            durationMinutes: Math.round(durationSeconds / 60),\n            tollCostMXN\n        };\n    } catch  {\n        return null;\n    }\n}\nfunction calculateFuelCost(distanceKm, fuelEfficiencyKmL, fuelPriceMXN) {\n    if (fuelEfficiencyKmL <= 0) return 0;\n    const litersNeeded = distanceKm / fuelEfficiencyKmL;\n    return litersNeeded * fuelPriceMXN;\n}\nfunction formatDistance(km) {\n    if (km < 1) return `${Math.round(km * 1000)} m`;\n    return `${km.toFixed(1)} km`;\n}\nfunction formatDuration(minutes) {\n    const h = Math.floor(minutes / 60);\n    const m = minutes % 60;\n    if (h === 0) return `${m} min`;\n    if (m === 0) return `${h}h`;\n    return `${h}h ${m}min`;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL21hcHMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVFPLGVBQWVBLHNCQUNwQkMsU0FBaUIsRUFDakJDLFNBQWlCLEVBQ2pCQyxPQUFlLEVBQ2ZDLE9BQWU7SUFFZixNQUFNQyxTQUFTQyx5Q0FBMkM7SUFDMUQsSUFBSSxDQUFDRCxRQUFRLE9BQU87SUFFcEIsSUFBSTtRQUNGLE1BQU1JLE1BQU0sTUFBTUMsTUFDaEIsNkRBQ0E7WUFDRUMsUUFBUTtZQUNSQyxTQUFTO2dCQUNQLGdCQUFnQjtnQkFDaEIsa0JBQWtCUDtnQkFDbEIsb0JBQ0U7WUFDSjtZQUNBUSxNQUFNQyxLQUFLQyxTQUFTLENBQUM7Z0JBQ25CQyxRQUFRO29CQUNOQyxVQUFVO3dCQUFFQyxRQUFROzRCQUFFQyxVQUFVbEI7NEJBQVdtQixXQUFXbEI7d0JBQVU7b0JBQUU7Z0JBQ3BFO2dCQUNBbUIsYUFBYTtvQkFDWEosVUFBVTt3QkFBRUMsUUFBUTs0QkFBRUMsVUFBVWhCOzRCQUFTaUIsV0FBV2hCO3dCQUFRO29CQUFFO2dCQUNoRTtnQkFDQWtCLFlBQVk7Z0JBQ1pDLG1CQUFtQjtvQkFBQztpQkFBUTtnQkFDNUJDLGdCQUFnQjtvQkFDZEMsYUFBYTt3QkFBRUMsY0FBYztvQkFBVztnQkFDMUM7WUFDRjtRQUNGO1FBR0YsSUFBSSxDQUFDakIsSUFBSWtCLEVBQUUsRUFBRSxPQUFPO1FBQ3BCLE1BQU1DLE9BQU8sTUFBTW5CLElBQUlvQixJQUFJO1FBQzNCLE1BQU1DLFFBQVFGLEtBQUtHLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDOUIsSUFBSSxDQUFDRCxPQUFPLE9BQU87UUFFbkIsTUFBTUUsYUFBYUYsTUFBTUcsY0FBYyxFQUFFQyxVQUFVQztRQUNuRCxNQUFNQyxVQUFVSixZQUFZSyxLQUFLLENBQUNDLElBQVdBLEVBQUVDLFlBQVksS0FBSztRQUNoRSxNQUFNQyxjQUFjSixVQUNoQkssV0FBV0wsUUFBUU0sS0FBSyxJQUFJLE9BQU8sQ0FBQ04sUUFBUU8sS0FBSyxJQUFJLEtBQUssTUFDMUQ7UUFFSixNQUFNQyxpQkFBaUJkLE1BQU1jLGNBQWMsSUFBSTtRQUMvQyxNQUFNQyxrQkFBa0JDLFNBQ3RCLENBQUNoQixNQUFNaUIsUUFBUSxJQUFJLElBQUcsRUFBR0MsT0FBTyxDQUFDLEtBQUssS0FDdEM7UUFHRixPQUFPO1lBQ0xKO1lBQ0FLLFlBQVlMLGlCQUFpQjtZQUM3QkM7WUFDQUssaUJBQWlCQyxLQUFLQyxLQUFLLENBQUNQLGtCQUFrQjtZQUM5Q0w7UUFDRjtJQUNGLEVBQUUsT0FBTTtRQUNOLE9BQU87SUFDVDtBQUNGO0FBRU8sU0FBU2Esa0JBQ2RKLFVBQWtCLEVBQ2xCSyxpQkFBeUIsRUFDekJDLFlBQW9CO0lBRXBCLElBQUlELHFCQUFxQixHQUFHLE9BQU87SUFDbkMsTUFBTUUsZUFBZVAsYUFBYUs7SUFDbEMsT0FBT0UsZUFBZUQ7QUFDeEI7QUFFTyxTQUFTRSxlQUFlQyxFQUFVO0lBQ3ZDLElBQUlBLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRVAsS0FBS0MsS0FBSyxDQUFDTSxLQUFLLE1BQU0sRUFBRSxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxFQUFFQSxHQUFHQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDOUI7QUFFTyxTQUFTQyxlQUFlQyxPQUFlO0lBQzVDLE1BQU1DLElBQUlYLEtBQUtZLEtBQUssQ0FBQ0YsVUFBVTtJQUMvQixNQUFNRyxJQUFJSCxVQUFVO0lBQ3BCLElBQUlDLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBRUUsRUFBRSxJQUFJLENBQUM7SUFDOUIsSUFBSUEsTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFRixFQUFFLENBQUMsQ0FBQztJQUMzQixPQUFPLENBQUMsRUFBRUEsRUFBRSxFQUFFLEVBQUVFLEVBQUUsR0FBRyxDQUFDO0FBQ3hCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2l0cmlwLy4vc3JjL2xpYi9tYXBzLnRzPzc1YzYiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBSb3V0ZVNlZ21lbnQge1xuICBkaXN0YW5jZU1ldGVyczogbnVtYmVyO1xuICBkaXN0YW5jZUttOiBudW1iZXI7XG4gIGR1cmF0aW9uU2Vjb25kczogbnVtYmVyO1xuICBkdXJhdGlvbk1pbnV0ZXM6IG51bWJlcjtcbiAgdG9sbENvc3RNWE46IG51bWJlciB8IG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWxjdWxhdGVSb3V0ZVNlZ21lbnQoXG4gIG9yaWdpbkxhdDogbnVtYmVyLFxuICBvcmlnaW5Mbmc6IG51bWJlcixcbiAgZGVzdExhdDogbnVtYmVyLFxuICBkZXN0TG5nOiBudW1iZXJcbik6IFByb21pc2U8Um91dGVTZWdtZW50IHwgbnVsbD4ge1xuICBjb25zdCBhcGlLZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19HT09HTEVfTUFQU19BUElfS0VZO1xuICBpZiAoIWFwaUtleSkgcmV0dXJuIG51bGw7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcbiAgICAgIFwiaHR0cHM6Ly9yb3V0ZXMuZ29vZ2xlYXBpcy5jb20vZGlyZWN0aW9ucy92Mjpjb21wdXRlUm91dGVzXCIsXG4gICAgICB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICBcIlgtR29vZy1BcGktS2V5XCI6IGFwaUtleSxcbiAgICAgICAgICBcIlgtR29vZy1GaWVsZE1hc2tcIjpcbiAgICAgICAgICAgIFwicm91dGVzLmRpc3RhbmNlTWV0ZXJzLHJvdXRlcy5kdXJhdGlvbixyb3V0ZXMudHJhdmVsQWR2aXNvcnkudG9sbEluZm9cIixcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIG9yaWdpbjoge1xuICAgICAgICAgICAgbG9jYXRpb246IHsgbGF0TG5nOiB7IGxhdGl0dWRlOiBvcmlnaW5MYXQsIGxvbmdpdHVkZTogb3JpZ2luTG5nIH0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICBsb2NhdGlvbjogeyBsYXRMbmc6IHsgbGF0aXR1ZGU6IGRlc3RMYXQsIGxvbmdpdHVkZTogZGVzdExuZyB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0cmF2ZWxNb2RlOiBcIkRSSVZFXCIsXG4gICAgICAgICAgZXh0cmFDb21wdXRhdGlvbnM6IFtcIlRPTExTXCJdLFxuICAgICAgICAgIHJvdXRlTW9kaWZpZXJzOiB7XG4gICAgICAgICAgICB2ZWhpY2xlSW5mbzogeyBlbWlzc2lvblR5cGU6IFwiR0FTT0xJTkVcIiB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoIXJlcy5vaykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgY29uc3Qgcm91dGUgPSBkYXRhLnJvdXRlcz8uWzBdO1xuICAgIGlmICghcm91dGUpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgdG9sbFByaWNlcyA9IHJvdXRlLnRyYXZlbEFkdmlzb3J5Py50b2xsSW5mbz8uZXN0aW1hdGVkUHJpY2U7XG4gICAgY29uc3QgbXhuVG9sbCA9IHRvbGxQcmljZXM/LmZpbmQoKHA6IGFueSkgPT4gcC5jdXJyZW5jeUNvZGUgPT09IFwiTVhOXCIpO1xuICAgIGNvbnN0IHRvbGxDb3N0TVhOID0gbXhuVG9sbFxuICAgICAgPyBwYXJzZUZsb2F0KG14blRvbGwudW5pdHMgfHwgXCIwXCIpICsgKG14blRvbGwubmFub3MgfHwgMCkgLyAxZTlcbiAgICAgIDogbnVsbDtcblxuICAgIGNvbnN0IGRpc3RhbmNlTWV0ZXJzID0gcm91dGUuZGlzdGFuY2VNZXRlcnMgPz8gMDtcbiAgICBjb25zdCBkdXJhdGlvblNlY29uZHMgPSBwYXJzZUludChcbiAgICAgIChyb3V0ZS5kdXJhdGlvbiA/PyBcIjBzXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpLFxuICAgICAgMTBcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3RhbmNlTWV0ZXJzLFxuICAgICAgZGlzdGFuY2VLbTogZGlzdGFuY2VNZXRlcnMgLyAxMDAwLFxuICAgICAgZHVyYXRpb25TZWNvbmRzLFxuICAgICAgZHVyYXRpb25NaW51dGVzOiBNYXRoLnJvdW5kKGR1cmF0aW9uU2Vjb25kcyAvIDYwKSxcbiAgICAgIHRvbGxDb3N0TVhOLFxuICAgIH07XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVGdWVsQ29zdChcbiAgZGlzdGFuY2VLbTogbnVtYmVyLFxuICBmdWVsRWZmaWNpZW5jeUttTDogbnVtYmVyLFxuICBmdWVsUHJpY2VNWE46IG51bWJlclxuKTogbnVtYmVyIHtcbiAgaWYgKGZ1ZWxFZmZpY2llbmN5S21MIDw9IDApIHJldHVybiAwO1xuICBjb25zdCBsaXRlcnNOZWVkZWQgPSBkaXN0YW5jZUttIC8gZnVlbEVmZmljaWVuY3lLbUw7XG4gIHJldHVybiBsaXRlcnNOZWVkZWQgKiBmdWVsUHJpY2VNWE47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREaXN0YW5jZShrbTogbnVtYmVyKTogc3RyaW5nIHtcbiAgaWYgKGttIDwgMSkgcmV0dXJuIGAke01hdGgucm91bmQoa20gKiAxMDAwKX0gbWA7XG4gIHJldHVybiBgJHtrbS50b0ZpeGVkKDEpfSBrbWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREdXJhdGlvbihtaW51dGVzOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCBoID0gTWF0aC5mbG9vcihtaW51dGVzIC8gNjApO1xuICBjb25zdCBtID0gbWludXRlcyAlIDYwO1xuICBpZiAoaCA9PT0gMCkgcmV0dXJuIGAke219IG1pbmA7XG4gIGlmIChtID09PSAwKSByZXR1cm4gYCR7aH1oYDtcbiAgcmV0dXJuIGAke2h9aCAke219bWluYDtcbn1cbiJdLCJuYW1lcyI6WyJjYWxjdWxhdGVSb3V0ZVNlZ21lbnQiLCJvcmlnaW5MYXQiLCJvcmlnaW5MbmciLCJkZXN0TGF0IiwiZGVzdExuZyIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19HT09HTEVfTUFQU19BUElfS0VZIiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcmlnaW4iLCJsb2NhdGlvbiIsImxhdExuZyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZGVzdGluYXRpb24iLCJ0cmF2ZWxNb2RlIiwiZXh0cmFDb21wdXRhdGlvbnMiLCJyb3V0ZU1vZGlmaWVycyIsInZlaGljbGVJbmZvIiwiZW1pc3Npb25UeXBlIiwib2siLCJkYXRhIiwianNvbiIsInJvdXRlIiwicm91dGVzIiwidG9sbFByaWNlcyIsInRyYXZlbEFkdmlzb3J5IiwidG9sbEluZm8iLCJlc3RpbWF0ZWRQcmljZSIsIm14blRvbGwiLCJmaW5kIiwicCIsImN1cnJlbmN5Q29kZSIsInRvbGxDb3N0TVhOIiwicGFyc2VGbG9hdCIsInVuaXRzIiwibmFub3MiLCJkaXN0YW5jZU1ldGVycyIsImR1cmF0aW9uU2Vjb25kcyIsInBhcnNlSW50IiwiZHVyYXRpb24iLCJyZXBsYWNlIiwiZGlzdGFuY2VLbSIsImR1cmF0aW9uTWludXRlcyIsIk1hdGgiLCJyb3VuZCIsImNhbGN1bGF0ZUZ1ZWxDb3N0IiwiZnVlbEVmZmljaWVuY3lLbUwiLCJmdWVsUHJpY2VNWE4iLCJsaXRlcnNOZWVkZWQiLCJmb3JtYXREaXN0YW5jZSIsImttIiwidG9GaXhlZCIsImZvcm1hdER1cmF0aW9uIiwibWludXRlcyIsImgiLCJmbG9vciIsIm0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/maps.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"error\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUMsTUFBTUMsa0JBQWtCQztBQUVqQixNQUFNQyxTQUNYRixnQkFBZ0JFLE1BQU0sSUFDdEIsSUFBSUgsd0RBQVlBLENBQUM7SUFBRUksS0FBS0MsS0FBc0MsR0FBRztRQUFDO0tBQVEsR0FBRyxDQUFFO0FBQUMsR0FBRztBQUVyRixJQUFJQSxJQUFxQyxFQUFFSixnQkFBZ0JFLE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXRyaXAvLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB9O1xuXG5leHBvcnQgY29uc3QgcHJpc21hID1cbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fFxuICBuZXcgUHJpc21hQ2xpZW50KHsgbG9nOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiID8gW1wiZXJyb3JcIl0gOiBbXSB9KTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/@babel","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmaps%2Froute%2Froute&page=%2Fapi%2Fmaps%2Froute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmaps%2Froute%2Froute.ts&appDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnefgt%5CDocuments%5CNext%5Csitrip&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();