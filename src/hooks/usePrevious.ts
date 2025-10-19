import React from 'react';

export type UsePreviousOptions<Value> = {
    equality: (a: Value, b: Value) => boolean;
};

export function usePrevious<Value>(value: Value, options?: UsePreviousOptions<Value>) {
    const currentRef = React.useRef<Value>(value);
    const previousRef = React.useRef<Value>(undefined);

    const equality = options?.equality ?? Object.is;

    if (!equality(value, currentRef.current)) {
        previousRef.current = currentRef.current;
        currentRef.current = value;
    }

    return previousRef.current;
}
