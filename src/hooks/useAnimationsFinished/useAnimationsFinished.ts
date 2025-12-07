import type React from 'react';
import ReactDOM from 'react-dom';

import { resolveRef } from '~@lib/resolveRef';

import { useAnimationFrame } from '../useAnimationFrame';
import { useStableCallback } from '../useStableCallback';

export function useAnimationsFinished(
    elementOrRef: React.RefObject<HTMLElement | null> | HTMLElement | null,
    waitForNextTick = false,
    treatAbortedAsFinished = true
) {
    const frame = useAnimationFrame();

    return useStableCallback(
        (
            /**
             * A function to execute once all animations have finished.
             */
            fnToExecute: () => void,
            /**
             * An optional [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
             * can be used to abort `fnToExecute` before all the animations have finished.
             * @default null
             */
            signal: AbortSignal | null = null
        ) => {
            frame.cancel();

            const element = resolveRef(elementOrRef);
            if (element == null) {
                return;
            }

            if (typeof element.getAnimations !== 'function' || globalThis.FLIPPO_UI_ANIMATIONS_DISABLED) {
                fnToExecute();
            }
            else {
                frame.request(() => {
                    function exec() {
                        if (!element) {
                            return;
                        }

                        Promise.all(element.getAnimations().map((anim) => anim.finished))
                            .then(() => {
                                if (signal != null && signal.aborted) {
                                    return;
                                }

                                // Synchronously flush the unmounting of the component so that the browser doesn't
                                // paint: https://github.com/mui/base-ui/issues/979
                                ReactDOM.flushSync(fnToExecute);
                            })
                            .catch(() => {
                                if (treatAbortedAsFinished) {
                                    if (signal != null && signal.aborted) {
                                        return;
                                    }

                                    ReactDOM.flushSync(fnToExecute);
                                }
                                else if (
                                    element.getAnimations().length > 0
                                    && element

                                        .getAnimations()
                                        .some((anim) => anim.pending || anim.playState !== 'finished')
                                ) {
                                    // Sometimes animations can be aborted because a property they depend on changes
                                    //  while the animation plays.
                                    // In such cases, we need to re-check if any new animations have started.
                                    exec();
                                }
                            });
                    }

                    // `open: true` animations need to wait for the next tick to be detected
                    if (waitForNextTick) {
                        frame.request(exec);
                    }
                    else {
                        exec();
                    }
                });
            }
        }
    );
}
