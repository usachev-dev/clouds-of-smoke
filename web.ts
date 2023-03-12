import { serve } from "https://deno.land/std@0.179.0/http/server.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

const decoder = new TextDecoder("utf-8");
const md = decoder.decode(await Deno.readFile("./readme.MD"));
const markup = Marked.parse(md);

const handler = async (_request: Request): Promise<Response> => {

  return await new Response(`
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
`, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
};

serve(handler);