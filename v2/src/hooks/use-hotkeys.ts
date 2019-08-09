import {useCallback, useEffect} from "react";

export type Hotkey = {
    matches(event: KeyboardEvent): boolean;
    execute(event: KeyboardEvent): void;
};

export default function useHotkeys(hotkeys: Array<Hotkey>) {
    const listener = useCallback((event: KeyboardEvent) => {
        hotkeys
            .filter((hotkey) => hotkey.matches(event))
            .forEach((hotkey) => hotkey.execute(event));

    }, [hotkeys]);

    useEffect(() => {
        document.body.addEventListener('keyup', listener);
        return () => document.body.removeEventListener('keyup', listener);
    }, [listener]);
}

export function erAltOg(char: string): (event: KeyboardEvent) => boolean {
    return (event) => {
        return event.altKey && char.toLowerCase() === event.key.toLowerCase();
    };
}

export function openUrl(url: string): () => void {
    return () => {
        window.open(url, '_blank');
    };
}