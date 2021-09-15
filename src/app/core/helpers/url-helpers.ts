import { environment } from 'environments/environment';

export function apiUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error('Path must start with a "/"');
  }

  return `${environment.apiUrl}${path}`;
}
