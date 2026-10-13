import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

export function useWindowEvent<K extends WindowEventMap | (string & {})>(
    type: K,
    listener: K extends keyof WindowEventMap
        ? (this: Window, ev: WindowEventMap[K]) => void
        : (this: Window, ev: CustomEvent) => void,
    options?: boolean | AddEventListenerOptions
) {
    useIsoLayoutEffect(() => {
        if (!window)
            return;

        // eslint-disable-next-line react-web-api/no-leaked-event-listener
        window.addEventListener(type as any, listener, options);

        return () => window.removeEventListener(type as any, listener, options);
    }, [type, listener]);
}
