import type { ProxyRequest, ProxyResponse } from '@/types/openapi';

export async function sendRequest(request: ProxyRequest): Promise<ProxyResponse> {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    return {
      status: 500,
      statusText: 'Internal Error',
      headers: {},
      body: '',
      duration: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
