import { serve } from "https://deno.land/std@0.179.0/http/server.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

const decoder = new TextDecoder("utf-8");
const md = decoder.decode(await Deno.readFile("./readme.MD"));
const markup = Marked.parse(md);

import { Application, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

const DIST_DIR = "./dist",
  ROOT_DIR_PATH = "/dist";

app.use(async (ctx, next) => {
  if (!ctx.request.url.pathname.startsWith(ROOT_DIR_PATH)) {
    next();
    return;
  }
  await send(ctx, ctx.request.url.pathname, {
    root: "./",
  });
});


app.use((ctx) => {
  ctx.response.body = `
  <!DOCTYPE html>
  <html lang="ru">
  <head>
      <meta charset="utf-8">
      <title>Облака дыма</title>
  </head>
  <body>
  ${markup.content}
  </body>
  </html>  
  `;
});

await app.listen({ port: 8000 });
