```js import * as eta from "https://deno.land/x/eta@v2.1.0/mod.ts" ```
const decoder = new TextDecoder("utf-8");
const html = decoder.decode(await Deno.readFile("./templates/layout.html"));
