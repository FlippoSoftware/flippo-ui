import React from 'react';

export type UsePreviousValueOptions<Value> = {
    equality: (a: Value, b: Value) => boolean;
};

export function usePreviousValue<Value>(value: Value, options?: UsePreviousValueOptions<Value>) {
    const currentRef = React.useRef<Value>(value);
    const previousRef = React.useRef<Value>(undefined);

    const equality = options?.equality ?? Object.is;

    if (!equality(value, currentRef.current)) {
        previousRef.current = currentRef.current;
        currentRef.current = value;
    }

    return previousRef.current;
}
