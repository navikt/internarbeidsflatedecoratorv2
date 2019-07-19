import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";

export interface FieldState {
    input: {
        value: string;
        onChange: React.ChangeEventHandler;
    },
    setValue: Dispatch<SetStateAction<string>>;
    isPristine(trim: boolean): boolean;
}

export default function useFieldState(initialState: string): FieldState {
    const [value, setValue] = useState(initialState);
    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value),
        [setValue]
    );

    useEffect(() => {
        setValue(initialState);
    }, [initialState]);

    return {
        input: {
            value,
            onChange,
        },
        setValue,
        isPristine: (trim) => trim ? (value.trim() === initialState.trim()) : (value === initialState)
    };
}