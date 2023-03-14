import * as mod from "https://deno.land/std@0.179.0/encoding/toml.ts";
import {State} from "./state.ts";
const decoder = new TextDecoder("utf-8");
const toml = decoder.decode(await Deno.readFile("./assets/locales/locales.toml"));
import {Context}  from "https://deno.land/x/oak@v12.1.0/context.ts";
import { Accepts } from "https://deno.land/x/accepts/mod.ts";

const LANG_COOKIE = 'lang';
export let supportedLangs = ["ru", "en"];

let result = {};
try {
  result = mod.parse(toml)
} catch(e) {
  console.error("Error parsing locales toml: ", e)
}

export let locales = supportedLangs.reduce((acc, lang, index) => {
  acc[lang] = {}
  acc[lang] = Object.keys(result).reduce((acc, key) => ({...acc, [key]: result[key][lang]}), {})
  return acc
}, {});

function redirectToLangPage(ctx: Context<State>, lang: string) {
  let param = ctx.request.url.searchParams.get('lang')
  if (lang == 'en' && !param) {
    return
  }
  if (lang == param) {
    return
  }
  let params = ctx.request.url.search
  if (params.length > 0) {
    params = `${params}&lang=${lang}`
  } else {
    params = `?lang=${lang}`
  }
  let url = ctx.request.url.origin + ctx.request.url.pathname + params
  ctx.response.redirect(url);
}

export async function setRequestLocale(ctx: Context<State>, next: () => any) {
  if (!!ctx.state.lang && !!ctx.state.locale) {
    return
  }

  let lang;
  let langCookie = await ctx.cookies.get(LANG_COOKIE)
  let urlLang = ctx.request.url.searchParams.get('lang')
  if (!!urlLang  && !!locales[urlLang]) {
    if (langCookie != urlLang) {
      await ctx.cookies.set(LANG_COOKIE, urlLang)
    }
    ctx.state.lang = urlLang;
    ctx.state.locale = locales[urlLang]
    next()
    return
  }

  if (!!langCookie && !!locales[langCookie]) {
    ctx.state.lang = langCookie;
    ctx.state.locale = locales[langCookie]
    if (langCookie != 'en') {
      redirectToLangPage(ctx, langCookie)
    }
    next();
    return
  }

  let accept = new Accepts(ctx.request.headers)
  let acceptedLang = accept.languages(supportedLangs)
  if (!acceptedLang) {
    lang = 'en';
  } else {
    lang = acceptedLang
  }

  ctx.state.lang = lang;
  ctx.state.locale = locales[lang]
  await ctx.cookies.set(LANG_COOKIE, lang)
  if (lang != 'en') {
    redirectToLangPage(ctx, lang)
  }
  next();
  return;

}
