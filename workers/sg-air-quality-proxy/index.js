const TARGET = 'https://api-open.data.gov.sg/v2/real-time/api';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ALLOWED = new Set(['psi', 'pm25']);

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const endpoint = url.pathname.replace(/^\/+/, '');

    if (!ALLOWED.has(endpoint)) {
      return new Response('Not found', { status: 404, headers: CORS });
    }

    const target = new URL(`${TARGET}/${endpoint}`);
    for (const [k, v] of url.searchParams) target.searchParams.set(k, v);

    try {
      const res = await fetch(target.toString(), {
        headers: { Authorization: env.API_KEY },
        // Cache identical requests at Cloudflare's edge for 5 minutes
        cf: { cacheTtl: 300, cacheEverything: true },
      });

      const body = await res.text();

      return new Response(body, {
        status: res.status,
        headers: {
          ...CORS,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }
  },
};
