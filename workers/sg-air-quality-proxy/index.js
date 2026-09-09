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
      // Pass key as query parameter — header-based auth is stripped
      // by some intermediaries on server-to-server requests
      target.searchParams.set('api-key', env.API_KEY);

      const res = await fetch(target.toString(), {
        cf: { cacheEverything: false },
      });

      const body = await res.text();

      // Only cache successful responses
      const cacheHeaders = res.ok
        ? { 'Cache-Control': 'public, max-age=300' }
        : { 'Cache-Control': 'no-store' };

      return new Response(body, {
        status: res.status,
        headers: {
          ...CORS,
          'Content-Type': 'application/json',
          'X-Upstream-Status': String(res.status),
          ...cacheHeaders,
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
