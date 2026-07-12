import type { HttpMethod } from '@/types/openapi';

interface CurlGeneratorParams {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: unknown;
}

export function generateCurl({ method, url, headers, body }: CurlGeneratorParams): string {
  const escapedUrl = url.replace(/"/g, '\\"');

  let curl = `curl -X ${method} "${escapedUrl}"`;

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      const escapedValue = value.replace(/"/g, '\\"');
      curl += ` \\\n  -H "${key}: ${escapedValue}"`;
    }
  }

  if (body) {
    let bodyStr: string;
    if (typeof body === 'string') {
      bodyStr = body;
    } else {
      bodyStr = JSON.stringify(body, null, 2);
    }

    const escapedBody = bodyStr.replace(/'/g, "'\\''");
    curl += ` \\\n  -d '${escapedBody}'`;
  }

  return curl;
}
