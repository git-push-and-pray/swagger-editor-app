import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, method, headers, body } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const startTime = Date.now();

    const requestHeaders: Record<string, string> = {
      ...headers,
      'User-Agent': 'SwaggerViewer/1.0',
    };

    if (body && !headers['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method: method || 'GET',
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseBody = await response.text();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      body: responseBody,
      duration,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      },
      { status: 500 }
    );
  }
}
