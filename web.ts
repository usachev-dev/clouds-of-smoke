import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import { Application, Router} from "https://deno.land/x/oak/mod.ts";
import {staticServer} from "./web/static.ts";
import {locales, setRequestLocale} from "./web/locales.ts";
import {State} from "./web/state.ts";

const decoder = new TextDecoder("utf-8");
const md = decoder.decode(await Deno.readFile("./readme.MD"));
const markup = Marked.parse(md);


const app = new Application<State>();
const router = new Router();

app.use(staticServer)
app.use(setRequestLocale)

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

console.log('locales', locales)

await app.listen({ port: 8000 });
