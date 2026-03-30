import { resolve, dirname, relative, join } from 'node:path';
import { platform } from 'node:os';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createNitro, createDevServer, build, prepare, copyPublicAssets, prerender } from 'nitropack';
import { toNodeListener } from 'h3';
import { normalizePath } from 'vite';
import defu from 'defu';
import { createConsola } from 'consola';

const logger = createConsola({
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
        dir: normalizePath(resolve(workspaceRoot, ".vercel", "output")),
        publicDir: normalizePath(
          resolve(workspaceRoot, ".vercel", "output/static")
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

const isWindows = platform() === "win32";
const filePrefix = isWindows ? "file:///" : "";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function nitro(nitroOptions) {
  const workspaceRoot = process.cwd();
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
      const rootDir = relative(workspaceRoot, config.root || ".") || ".";
      clientOutputPath = resolve(
        workspaceRoot,
        rootDir,
        config.build?.outDir || "dist"
      );
      nitroConfig = defu(nitroOptions, {
        rootDir,
        srcDir: normalizePath(`${rootDir}/${nitroOptions?.srcDir || "server"}`),
        preset: process.env.BUILD_PRESET,
        compatibilityDate: "2024-10-16",
        output: {
          dir: normalizePath(
            resolve(workspaceRoot, "dist", rootDir, "output")
          ),
          publicDir: normalizePath(
            resolve(workspaceRoot, "dist", rootDir, "output/public")
          )
        },
        buildDir: normalizePath(
          resolve(workspaceRoot, "dist", rootDir, ".nitro")
        )
      });
    },
    async configureServer(viteServer) {
      if (!isServe)
        return;
      const devConfig = defu({
        dev: true,
        routeRules: {
          "/**": { proxy: `${apiPrefix}/**` }
        }
      }, nitroConfig);
      const nitro2 = await createNitro(devConfig);
      const server = createDevServer(nitro2);
      await build(nitro2);
      viteServer.middlewares.use(apiPrefix, toNodeListener(server.app));
      viteServer.httpServer?.once("listening", () => {
        const { host, port } = viteServer.config.server;
        process.env.NITRO_HOST = host ? String(host) : "localhost";
        process.env.NITRO_PORT = String(port);
      });
      logger.info(`The server endpoints are accessible under the "${apiPrefix}" path.`);
    },
    async closeBundle() {
      if (!isBuild)
        return;
      const buildConfig = defu(
        withPreset(nitroConfig.preset || "node-server", workspaceRoot),
        {
          dev: false,
          publicAssets: [{ dir: clientOutputPath }],
          renderer: filePrefix + normalizePath(join(__dirname, `runtime/renderer${filePrefix ? ".mjs" : ""}`)),
          alias: {
            "#nitro/index": normalizePath(
              resolve(clientOutputPath, "index.html")
            )
          }
        },
        nitroConfig
      );
      const nitro2 = await createNitro(buildConfig);
      await prepare(nitro2);
      await copyPublicAssets(nitro2);
      if (nitroConfig?.prerender?.routes && nitroConfig?.prerender?.routes?.length > 0) {
        logger.start(`Prerendering static pages...`);
        await prerender(nitro2);
      }
      if (!nitroConfig?.static) {
        logger.start("Building Server...");
        await build(nitro2);
      }
      await nitro2.close();
      logger.success(`The server has been successfully built.`);
    }
  };
}

export { nitro as default };
