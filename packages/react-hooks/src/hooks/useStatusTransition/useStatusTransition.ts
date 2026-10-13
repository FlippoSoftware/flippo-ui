import React from 'react';
import ReactDOM from 'react-dom';

import { AnimationFrame } from '../useAnimationFrame';
import { useEventCallback } from '../useEventCallback';
import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

export type StatusTransition = 'starting' | 'ending' | 'idle' | 'between' | undefined;

/**
 * Universal hook for smooth transitions between any status values.
 * Uses clear naming: shouldBeMounted/shouldBeUnmounted instead of isActive/isIdle.
 *
 * @example
 * ```tsx
 * // For QR code with mount/unmount transitions
 * const { mounted, transitionStatus, currentStatus } = useStatusTransitionV2({
 *     status: qrStatus,
 *     shouldBeMounted: (status) => status !== 'idle',
 *     shouldBeUnmounted: (status) => status === 'idle',
 *     transitionDuration: 300
 * });
 *
 * // For modal open/close
 * const { mounted, transitionStatus } = useStatusTransitionV2({
 *     status: isOpen,
 *     shouldBeMounted: (status) => status === true,
 *     shouldBeUnmounted: (status) => status === false,
 *     transitionDuration: 200
 * });
 *
 * // With transitions between all statuses
 * const { mounted, transitionStatus } = useStatusTransitionV2({
 *     status: connectionStatus,
 *     shouldBeMounted: (status) => status !== 'disconnected',
 *     shouldBeUnmounted: (status) => status === 'disconnected',
 *     transitionBetweenAllStatuses: true
 * });
 * ```
 */
export function useStatusTransition<TStatus>(config: useStatusTransition.Params<TStatus>):
useStatusTransition.ReturnValue {
    const {
        status,
        shouldBeMounted: shouldBeMountedParam,
        enableIdleState = false,
        deferEndingState = false
    } = config;

    const shouldBeMounted = useEventCallback(shouldBeMountedParam);

    const [transitionStatus, setTransitionStatus] = React.useState<StatusTransition>(() =>
        shouldBeMounted(status) && enableIdleState ? 'idle' : undefined
    );
    const [mounted, setMounted] = React.useState(() => shouldBeMounted(status));

    const shouldBeMountedNow = shouldBeMounted(status);

    // Sync unmount status - like floating-ui does
    if (!mounted && transitionStatus === 'ending') {
        setTransitionStatus(undefined);
    }

    // Handle mount/unmount transitions
    useIsoLayoutEffect(() => {
        // Mount transition: unmounted → mounted
        if (shouldBeMountedNow && !mounted) {
            setMounted(true);
            setTransitionStatus('starting');
            return;
        }

        // Unmount transition: mounted → unmounted
        if (!shouldBeMountedNow && mounted && transitionStatus !== 'ending') {
            if (!deferEndingState) {
                setTransitionStatus('ending');
            }
        }
    }, [shouldBeMountedNow, mounted, transitionStatus, deferEndingState]);

    // Handle ending transition completion (deferred)
    useIsoLayoutEffect(() => {
        if (!shouldBeMountedNow && mounted && transitionStatus !== 'ending' && deferEndingState) {
            const frame = AnimationFrame.request(() => {
                setTransitionStatus('ending');
            });

            return () => {
                AnimationFrame.cancel(frame);
            };
        }

        return undefined;
    }, [shouldBeMountedNow, mounted, transitionStatus, deferEndingState]);

    // Handle starting transition completion - like floating-ui
    useIsoLayoutEffect(() => {
        if (!shouldBeMountedNow || enableIdleState) {
            return undefined;
        }

        if (transitionStatus === 'starting') {
            const frame = AnimationFrame.request(() => {
                ReactDOM.flushSync(() => {
                    setTransitionStatus(undefined);
                });
            });

            return () => {
                AnimationFrame.cancel(frame);
            };
        }

        return undefined;
    }, [shouldBeMountedNow, enableIdleState, transitionStatus]);

    // Handle idle state when enabled
    useIsoLayoutEffect(() => {
        if (!enableIdleState || !shouldBeMountedNow) {
            return;
        }

        if (transitionStatus === 'starting') {
            const frame = AnimationFrame.request(() => {
                setTransitionStatus('idle');
            });

            return () => {
                AnimationFrame.cancel(frame);
            };
        }

        return undefined;
    }, [enableIdleState, shouldBeMountedNow, transitionStatus]);

    return React.useMemo(
        () => ({
            /**
             * Whether the component is currently mounted in the DOM
             */
            mounted,
            /**
             * Function to manually control mount state (use with caution)
             */
            setMounted,
            /**
             * Current transition state: 'starting', 'ending', 'idle', 'between', or undefined
             */
            transitionStatus

        }),
        [mounted, transitionStatus]
    );
}

namespace useStatusTransition {
    export type Params<TStatus> = {
        /**
         * The current status value
         */
        status: TStatus;

        /**
         * A function that determines if the component should be mounted for this status.
         * When true, the component will be in the DOM.
         *
         * @example
         * ```tsx
         * // For QR code: mount when not idle
         * shouldBeMounted: (status) => status !== 'idle'
         *
         * // For modal: mount when open
         * shouldBeMounted: (status) => status === true
         *
         * // For complex state: mount for specific statuses
         * shouldBeMounted: (status) => ['loading', 'success', 'error'].includes(status)
         * ```
         */
        shouldBeMounted: (status: TStatus) => boolean;

        /**
         * Enables the 'idle' state between 'starting' and 'ending' transitions.
         * When true, transitions will have three phases: starting → idle → undefined
         * When false, transitions will have two phases: starting → undefined
         * @default false
         */
        enableIdleState?: boolean;

        /**
         * If true, the ending state will not be set when the component is unmounted.
         * @default false
         */
        deferEndingState?: boolean;
    };

    export type ReturnValue = {
        mounted: boolean;
        setMounted: (mounted: boolean) => void;
        transitionStatus: StatusTransition;
    };
}
