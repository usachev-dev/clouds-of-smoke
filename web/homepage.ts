import {Context}  from "https://deno.land/x/oak@v12.1.0/context.ts";
import {State} from "./state.ts";
import {Marked} from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import {send} from "https://deno.land/x/oak/mod.ts";

const decoder = new TextDecoder("utf-8");
const md = decoder.decode(await Deno.readFile("./readme.MD"));
const markup = Marked.parse(md);

export async function homepage(ctx: Context<State>, next: () => any) {
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
}
