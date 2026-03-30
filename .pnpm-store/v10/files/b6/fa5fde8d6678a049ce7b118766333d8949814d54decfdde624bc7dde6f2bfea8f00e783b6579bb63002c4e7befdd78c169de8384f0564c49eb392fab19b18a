'use strict';

const node_path = require('node:path');
const node_os = require('node:os');
const process = require('node:process');
const node_url = require('node:url');
const nitropack = require('nitropack');
const h3 = require('h3');
const vite = require('vite');
const defu = require('defu');
const consola = require('consola');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const process__default = /*#__PURE__*/_interopDefaultCompat(process);
const defu__default = /*#__PURE__*/_interopDefaultCompat(defu);

const logger = consola.createConsola({
  level: 4,
  formatOptions: {
    columns: 80,
    colors: true,
    compact: false,
    date: false
  }
});

function withPreset(preset, workspaceRoot) {
  if (preset.includes("vercel")) {
    return {
      output: {
        dir: vite.normalizePath(node_path.resolve(workspaceRoot, ".vercel", "output")),
        publicDir: vite.normalizePath(
          node_path.resolve(workspaceRoot, ".vercel", "output/static")
        )
      }
    };
  } else if (preset.includes("cloudflare")) {
    return {
      cloudflare: {
        pages: {
          routes: {
            include: ["/api/*"]
          }
        }
      },
      output: {
        serverDir: "{{ output.publicDir }}/_worker.js"
      }
    };
  } else {
    return {};
  }
}

const isWindows = node_os.platform() === "win32";
const filePrefix = isWindows ? "file:///" : "";
const __filename$1 = node_url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href)));
const __dirname$1 = node_path.dirname(__filename$1);
function nitro(nitroOptions) {
  const workspaceRoot = process__default.cwd();
  const apiPrefix = "/api";
  let isBuild = false;
  let isServe = false;
  let nitroConfig = {};
  let clientOutputPath = "";
  return {
    name: "vite-plugin-with-nitro",
    enforce: "post",
    async config(config, { command }) {
      isServe = command === "serve";
      isBuild = command === "build";
      const rootDir = node_path.relative(workspaceRoot, config.root || ".") || ".";
      clientOutputPath = node_path.resolve(
        workspaceRoot,
        rootDir,
        config.build?.outDir || "dist"
      );
      nitroConfig = defu__default(nitroOptions, {
        rootDir,
        srcDir: vite.normalizePath(`${rootDir}/${nitroOptions?.srcDir || "server"}`),
        preset: process__default.env.BUILD_PRESET,
        compatibilityDate: "2024-10-16",
        output: {
          dir: vite.normalizePath(
            node_path.resolve(workspaceRoot, "dist", rootDir, "output")
          ),
          publicDir: vite.normalizePath(
            node_path.resolve(workspaceRoot, "dist", rootDir, "output/public")
          )
        },
        buildDir: vite.normalizePath(
          node_path.resolve(workspaceRoot, "dist", rootDir, ".nitro")
        )
      });
    },
    async configureServer(viteServer) {
      if (!isServe)
        return;
      const devConfig = defu__default({
        dev: true,
        routeRules: {
          "/**": { proxy: `${apiPrefix}/**` }
        }
      }, nitroConfig);
      const nitro2 = await nitropack.createNitro(devConfig);
      const server = nitropack.createDevServer(nitro2);
      await nitropack.build(nitro2);
      viteServer.middlewares.use(apiPrefix, h3.toNodeListener(server.app));
      viteServer.httpServer?.once("listening", () => {
        const { host, port } = viteServer.config.server;
        process__default.env.NITRO_HOST = host ? String(host) : "localhost";
        process__default.env.NITRO_PORT = String(port);
      });
      logger.info(`The server endpoints are accessible under the "${apiPrefix}" path.`);
    },
    async closeBundle() {
      if (!isBuild)
        return;
      const buildConfig = defu__default(
        withPreset(nitroConfig.preset || "node-server", workspaceRoot),
        {
          dev: false,
          publicAssets: [{ dir: clientOutputPath }],
          renderer: filePrefix + vite.normalizePath(node_path.join(__dirname$1, `runtime/renderer${filePrefix ? ".mjs" : ""}`)),
          alias: {
            "#nitro/index": vite.normalizePath(
              node_path.resolve(clientOutputPath, "index.html")
            )
          }
        },
        nitroConfig
      );
      const nitro2 = await nitropack.createNitro(buildConfig);
      await nitropack.prepare(nitro2);
      await nitropack.copyPublicAssets(nitro2);
      if (nitroConfig?.prerender?.routes && nitroConfig?.prerender?.routes?.length > 0) {
        logger.start(`Prerendering static pages...`);
        await nitropack.prerender(nitro2);
      }
      if (!nitroConfig?.static) {
        logger.start("Building Server...");
        await nitropack.build(nitro2);
      }
      await nitro2.close();
      logger.success(`The server has been successfully built.`);
    }
  };
}

module.exports = nitro;
