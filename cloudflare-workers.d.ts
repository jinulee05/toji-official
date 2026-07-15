declare module "cloudflare:workers" {
  export const env: {
    DB?: unknown;
  };
}

interface Fetcher {
  fetch(input: Request | string | URL, init?: RequestInit): Promise<Response>;
}

type D1Database = object;
