import { FetchResult } from '@apollo/client/core';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function mapMutationResult<T, R>(
  project: (data: T) => R
): OperatorFunction<FetchResult<T>, R> {
  return map<FetchResult<T>, R>((result) => {
    if (result.errors && result.errors.length) {
      throw new Error(result.errors.map((err) => err.message).join('\n'));
    }

    if (!result.data) {
      throw new Error('No data returned');
    }

    return project(result.data);
  });
}
