import {send} from "https://deno.land/x/oak/mod.ts";

const ROOT_DIR_PATH = "/dist";

export async function staticServer (ctx, next) {
  if (!ctx.request.url.pathname.startsWith(ROOT_DIR_PATH)) {
    next();
    return;
  }
  await send(ctx, ctx.request.url.pathname, {
    root: "./",
  });
}