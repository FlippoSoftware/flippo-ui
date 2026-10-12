import React from 'react';

import type { AvatarMachine } from '@flippo-software/core-components/avatar';

import type { ImageLoadingStatus } from './AvatarRoot';

export type AvatarRootContextValue = {
    /**
     * The core machine holding the image loading status shared by the image and the fallback.
     */
    avatar: AvatarMachine;
    imageLoadingStatus: ImageLoadingStatus;
};

export const AvatarRootContext = React.createContext<AvatarRootContextValue | undefined>(undefined);

export function useAvatarRootContext() {
    const context = React.use(AvatarRootContext);

    if (context === undefined) {
        throw new Error('Headless UI: AvatarRootContext is missing. Avatar parts must be placed within <Avatar.Root>.');
    }

    return context;
}
