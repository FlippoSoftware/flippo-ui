import React from 'react';
import ReactDOM from 'react-dom';

import { useEventCallback } from './useEventCallback';

export function useAnimationFinished(rootRef: React.RefObject<HTMLElement | null>, waitNextTick: boolean = false) {
    const frameRef = React.useRef(-1);
    const timerRef = React.useRef<NodeJS.Timeout | number>(-1);

    const cancelTasks = useEventCallback(() => {
        cancelAnimationFrame(frameRef.current);
        clearTimeout(timerRef.current);
    });

    React.useEffect(() => cancelTasks, [cancelTasks]);
    return useEventCallback((fnToExecute: () => void, signal: AbortSignal | null = null) => {
        cancelTasks();

        const element = rootRef.current;

        if (!element)
            return;

        if (typeof element.getAnimations !== 'function') {
            fnToExecute();
        }
        else {
            frameRef.current = requestAnimationFrame(() => {
                function exec() {
                    if (!element) {
                        return;
                    }

                    Promise.allSettled(element.getAnimations().map((animation) => animation.finished)).then(() => {
                        if (signal && signal.aborted)
                            return;

                        ReactDOM.flushSync(fnToExecute);
                    });
                }

                if (waitNextTick) {
                    timerRef.current = setTimeout(exec);
                }
                else {
                    exec();
                }
            });
        }
    });
}
