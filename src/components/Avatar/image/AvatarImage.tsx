import React from 'react';

import { AvatarImageLoader } from '@flippo-software/core-components/avatar';

import { useMachine, useStoreState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useAvatarRootContext } from '../root/AvatarRootContext';
import { avatarStyleHookMapping } from '../root/styleHooks';

import type { AvatarRoot, ImageLoadingStatus } from '../root/AvatarRoot';

/**
 * The image to be displayed in the avatar.
 * Renders an `<img>` element.
 *
 * Documentation: [Base UI Avatar](https://base-ui.com/react/components/avatar)
 */
export function AvatarImage(componentProps: AvatarImage.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        onLoadingStatusChange: onLoadingStatusChangeProp,
        referrerPolicy,
        crossOrigin,
        ref,
        ...elementProps
    } = componentProps;

    const { avatar } = useAvatarRootContext();
    const loader = useMachine((options) => new AvatarImageLoader(avatar, options), {
        src: componentProps.src,
        referrerPolicy,
        crossOrigin,
        onLoadingStatusChange: onLoadingStatusChangeProp
    });
    const imageLoadingStatus = useStoreState(loader.store).status;

    const state: AvatarRoot.State = React.useMemo(
        () => ({
            imageLoadingStatus
        }),
        [imageLoadingStatus]
    );

    const element = useRenderElement('img', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: avatarStyleHookMapping,
        enabled: imageLoadingStatus === 'loaded'
    });

    return element;
}

export namespace AvatarImage {
    export type Props = {
        /**
         * Callback fired when the loading status changes.
         */
        onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
    } & HeadlessUIComponentProps<'img', AvatarRoot.State>;
}
