import React from 'react';

export function useUnmount(callback: () => void) {
    const callbackRef = React.useRef(callback);
    callbackRef.current = callback;

    React.useEffect(() => () => {
        callbackRef.current();
    }, []);
}
