import {Application, Router, send} from "https://deno.land/x/oak/mod.ts";
import {staticServer} from "./web/static.ts";
import {setRequestLocale} from "./web/locales.ts";
import {State} from "./web/state.ts";
import {homepage} from "./web/homepage.ts";

const app = new Application<State>();
const router = new Router();

app.use(staticServer)
app.use(setRequestLocale)
console.log(await Deno.stat('./dist/favicon.ico'))
router.get("/", homepage)

app.use(router.routes());

await app.listen({port: 8000});
