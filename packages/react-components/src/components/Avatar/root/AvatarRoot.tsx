import React from 'react';

import { AvatarMachine } from '@flippo-software/core-components/avatar';

import { useStoreState } from '~@lib/core';
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

    // `useState` keeps one machine per instance; it has no options to sync.
    const [avatar] = React.useState(() => new AvatarMachine());
    const { imageLoadingStatus } = useStoreState(avatar.store);

    const state: AvatarRoot.State = React.useMemo(
        () => ({
            imageLoadingStatus
        }),
        [imageLoadingStatus]
    );

    const contextValue = React.useMemo(() => ({ avatar, imageLoadingStatus }), [avatar, imageLoadingStatus]);

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: avatarStyleHookMapping
    });

    return <AvatarRootContext value={contextValue}>{element}</AvatarRootContext>;
}

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export namespace AvatarRoot {
    export type Props = HeadlessUIComponentProps<'span', State>;

    export type State = {
        imageLoadingStatus: ImageLoadingStatus;
    };
}
