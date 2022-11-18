import React, { createContext, useMemo, useCallback, useEffect, useState, useContext } from 'react';
import { ActionHotkey, Hotkey, KeyDescription, KeyDescriptionObject } from '../../domain';

interface DecoratorHotkeys {
    decoratorHotkeys: Hotkey[];
    register(hotkey: Hotkey): void;
    unregister(hotkey: Hotkey): void;
}

const DecoratorHotkeysContext = createContext<DecoratorHotkeys>({
    decoratorHotkeys: [],
    register(hotkey: Hotkey) {},
    unregister(hotkey: Hotkey) {}
});

export function useDecoratorHotkeys(): DecoratorHotkeys {
    return useContext(DecoratorHotkeysContext);
}

export function DecoratorHotkeysProvider(props: { children: React.ReactNode }) {
    const [hotkeys, setHotkeys] = useState<{ [key: string]: Hotkey }>({});

    const register = useCallback(
        (hotkey: Hotkey) => {
            setHotkeys((prev) => ({
                ...prev,
                [describe(hotkey.key)]: hotkey
            }));
        },
        [setHotkeys]
    );

    const unregister = useCallback(
        (hotkey: Hotkey) => {
            setHotkeys(({ [describe(hotkey.key)]: removable, ...rest }) => rest);
        },
        [setHotkeys]
    );

    const ctxValue = useMemo(
        () => ({
            decoratorHotkeys: Object.values(hotkeys),
            register,
            unregister
        }),
        [hotkeys, register, unregister]
    );

    return (
        <DecoratorHotkeysContext.Provider value={ctxValue}>
            {props.children}
        </DecoratorHotkeysContext.Provider>
    );
}

export function describe(hotkey: KeyDescription): string {
    if (typeof hotkey === 'string') {
        return hotkey;
    } else {
        let parts: string[] = [];
        hotkey.ctrlKey && parts.push('Ctrl');
        hotkey.altKey && parts.push('Alt');
        hotkey.metaKey && parts.push('Meta');
        hotkey.shiftKey && parts.push('Shift');
        parts.push(hotkey.char);
        return parts.join('+');
    }
}

export function toKeyDescriptionObject(key: KeyDescription): KeyDescriptionObject {
    if (typeof key === 'string') {
        return { char: key, ctrlKey: false, altKey: false, metaKey: false, shiftKey: false };
    }
    return key;
}

export function matches(key: KeyDescriptionObject, event: KeyboardEvent): boolean {
    const { altKey, ctrlKey, metaKey, shiftKey } = key;
    const wantedKey = key.char.toLowerCase();
    const actualKey = (event.code ? event.code.replace('Key', '') : event.key || '').toLowerCase();

    return [
        wantedKey === actualKey,
        Boolean(altKey) === event.altKey,
        Boolean(ctrlKey) === event.ctrlKey,
        Boolean(metaKey) === event.metaKey,
        Boolean(shiftKey) === event.shiftKey
    ].every((comp) => comp);
}

export function useHurtigtastListener(hotkeys: Hotkey[]) {
    const actionHotkeys: ActionHotkey[] = useMemo(() => hotkeys.filter(isActionHotkey), [hotkeys]);
    const listener = useCallback(
        (event: KeyboardEvent) => {
            actionHotkeys
                .map(({ key, action }) => ({ key: toKeyDescriptionObject(key), action }))
                .filter(({ key }) => matches(key, event))
                .forEach(({ action }) => {
                    event.preventDefault();
                    action(event);
                });
        },
        [actionHotkeys]
    );

    useEffect(() => {
        document.body.addEventListener('keydown', listener);
        return () => document.body.removeEventListener('keydown', listener);
    }, [listener]);
}

export function isActionHotkey(hotkey: Hotkey): hotkey is ActionHotkey {
    return hotkey.hasOwnProperty('action');
}
