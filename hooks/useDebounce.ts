import { type DebounceSettings } from 'lodash';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';

export const DEFAULT_DEBOUNCE_TIME = 500;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

function useDebounce<T extends AnyFunction>(func: T, wait = DEFAULT_DEBOUNCE_TIME, options?: DebounceSettings) {
  return useCallback(debounce(func, wait, options), [func]);
}

export default useDebounce;
