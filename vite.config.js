import { fileURLToPath } from "url";

import { defineConfig, loadEnv } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { createVuePlugin } from "vite-plugin-vue2";
import { createHtmlPlugin } from "vite-plugin-html";
// @ts-ignore
import vueTemplateBabelCompiler from "vue-template-babel-compiler";
import scriptSetup from "unplugin-vue2-script-setup/vite";
import styleImport, { VantResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // if (command === "serve") {
  //   // dev 配置
  // } else if (command === "build") {
  //   // build 配置
  // }
  return {
    plugins: [
      createVuePlugin({
        jsx: true,
        vueTemplateOptions: {
          compiler: vueTemplateBabelCompiler,
        },
      }),
      scriptSetup(),
      legacy({
        targets: ["ie >= 11"],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      }),
      createHtmlPlugin({
        minify: true,
        entry: "src/main.js",
        template: "public/index.html",
        inject: {
          data: {
            title: "巅峰足球",
          },
        },
      }),
      styleImport({
        resolves: [VantResolve()],
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      open: true,
      host: "0.0.0.0",
      https: loadEnv(mode, process.cwd()).VITE_APP_PROTOCOL === "https",
      port: 3000,
      proxy: {
        "/df": {
          target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/dev-api/, ""),
        },
        "/df_test": {
          target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/dev-api/, ""),
        },
      },
    },
    build: {
      publicDir: command === "build" ? "./" : "/test-m-football/",
      outDir: command === "build" ? "mobile-football" : "test-m-football",
    },
  };
});
