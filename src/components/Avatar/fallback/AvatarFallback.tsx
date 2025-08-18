'use client';

import React from 'react';

import { useTimeout } from '@flippo_ui/hooks';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useAvatarRootContext } from '../root/AvatarRootContext';
import { avatarStyleHookMapping } from '../root/styleHooks';

import type { AvatarRoot } from '../root/AvatarRoot';

/**
 * Rendered when the image fails to load or when no image is provided.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Avatar](https://base-ui.com/react/components/avatar)
 */
export function AvatarFallback(componentProps: AvatarFallback.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        delay,
        ref,
        ...elementProps
    } = componentProps;

    const { imageLoadingStatus } = useAvatarRootContext();
    const [delayPassed, setDelayPassed] = React.useState(delay === undefined);
    const timeout = useTimeout();

    React.useEffect(() => {
        if (delay !== undefined) {
            timeout.start(delay, () => setDelayPassed(true));
        }
        return timeout.clear;
    }, [timeout, delay]);

    const state: AvatarRoot.State = React.useMemo(
        () => ({
            imageLoadingStatus
        }),
        [imageLoadingStatus]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: avatarStyleHookMapping,
        enabled: imageLoadingStatus !== 'loaded' && delayPassed
    });

    return element;
}

export namespace AvatarFallback {
    export type Props = {
        /**
         * How long to wait before showing the fallback. Specified in milliseconds.
         */
        delay?: number;
    } & HeadlessUIComponentProps<'span', AvatarRoot.State>;
}
