"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)(function (options) { return (__assign({ entry: {
        index: "src/components/index.ts",
        extensions: "src/extensions/index.ts",
        plugins: "src/plugins/index.ts",
        utils: "src/utils/index.ts",
    }, banner: {
        js: "'use client'",
    }, minify: true, format: ["cjs", "esm"], dts: true, clean: true, external: ["react", "react-dom"] }, options)); });
