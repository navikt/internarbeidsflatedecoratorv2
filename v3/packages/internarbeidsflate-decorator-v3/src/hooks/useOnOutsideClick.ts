import { Ref, useCallback, useEffect, useRef } from 'react';

export const useOnOutsideClick = <T extends Node>(
  onOutsideCallback: () => void,
): Ref<T> => {
  const ref = useRef<T>(null);

  const listener = useCallback(
    (event: Event) => {
      if (
        event.target instanceof Node &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        onOutsideCallback();
      }
    },
    [ref, onOutsideCallback],
  );

  useEffect(() => {
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, listener]);

  return ref;
};
