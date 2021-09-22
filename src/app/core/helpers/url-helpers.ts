import { environment } from 'environments/environment';

export function apiUrl(
  path: string,
  params?: { [key: string]: string }
): string {
  if (!path.startsWith('/')) {
    throw new Error('Path must start with a "/"');
  }

  const queryParams: string[] = [];

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      queryParams.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );
    }
  }

  if (queryParams.length) {
    return `${environment.apiUrl}${path}?${queryParams.join('&')}`;
  } else {
    return `${environment.apiUrl}${path}`;
  }
}
