import {send} from "https://deno.land/x/oak/mod.ts";

const ROOT_DIR_PATH = "/dist";

export function staticServer(ctx, next) {
  if (ctx.request.url.pathname == '/favicon.ico') {
    return send(ctx, "/favicon.ico", {
      root: `./dist`,
      index: "favicon.ico",
    }).catch(err => console.error("could not send favicon", err))
  }
  if (!ctx.request.url.pathname.startsWith(ROOT_DIR_PATH)) {
    next();
    return;
  }

  return send(ctx, ctx.request.url.pathname, {
    root: "./",
  });
}