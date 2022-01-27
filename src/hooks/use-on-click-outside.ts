import { RefObject, useEffect, useCallback } from 'react';

export default function useOnClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
    const listener = useCallback(
        (event: Event) => {
            if (
                event.target instanceof Node &&
                ref.current &&
                !ref.current.contains(event.target)
            ) {
                handler();
            }
        },
        [ref, handler]
    );

    useEffect(() => {
        document.body.addEventListener('mousedown', listener);
        return () => document.body.removeEventListener('mousedown', listener);
    }, [ref, listener]);
}
