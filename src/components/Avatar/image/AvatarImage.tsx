'use client';

import React from 'react';

import { useEventCallback, useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useAvatarRootContext } from '../root/AvatarRootContext';
import { avatarStyleHookMapping } from '../root/styleHooks';

import type { AvatarRoot } from '../root/AvatarRoot';

import { useImageLoadingStatus } from './useImageLoadingStatus';

import type { ImageLoadingStatus } from './useImageLoadingStatus';

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

    const context = useAvatarRootContext();
    const imageLoadingStatus = useImageLoadingStatus(componentProps.src, {
        referrerPolicy,
        crossOrigin
    });

    const handleLoadingStatusChange = useEventCallback((status: ImageLoadingStatus) => {
        onLoadingStatusChangeProp?.(status);
        context.setImageLoadingStatus(status);
    });

    useIsoLayoutEffect(() => {
        if (imageLoadingStatus !== 'idle') {
            handleLoadingStatusChange(imageLoadingStatus);
        }
    }, [imageLoadingStatus, handleLoadingStatusChange]);

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
