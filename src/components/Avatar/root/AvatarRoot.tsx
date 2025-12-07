

import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { AvatarRootContext } from './AvatarRootContext';
import { avatarStyleHookMapping } from './styleHooks';

/**
 * Displays a user's profile picture, initials, or fallback icon.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Avatar](https://base-ui.com/react/components/avatar)
 */
export function AvatarRoot(componentProps: AvatarRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

    const state: AvatarRoot.State = React.useMemo(
        () => ({
            imageLoadingStatus
        }),
        [imageLoadingStatus]
    );

    const contextValue = React.useMemo(
        () => ({
            imageLoadingStatus,
            setImageLoadingStatus
        }),
        [imageLoadingStatus, setImageLoadingStatus]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: avatarStyleHookMapping
    });

    return (
        <AvatarRootContext value={contextValue}>
            { element }
        </AvatarRootContext>
    );
}

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export namespace AvatarRoot {
    export type Props = HeadlessUIComponentProps<'span', State>;

    export type State = {
        imageLoadingStatus: ImageLoadingStatus;
    };
}
