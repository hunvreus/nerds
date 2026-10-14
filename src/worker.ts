import { handleJoin } from "./server/join";
import { resolveRedirect } from "./server/redirects";

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const redirect = resolveRedirect(url.pathname);

    if (redirect) return Response.redirect(redirect, 302);

    if (url.pathname === "/api/join") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
      return handleJoin(request);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
