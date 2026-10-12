import type { AvatarMachine } from '@flippo-software/core-components/avatar';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { AvatarElement } from './AvatarElement';

export const AvatarContext = createContext<AvatarElement>('avatar');

const AVATAR_ROOT = [AvatarContext] as const;

export abstract class AvatarPart extends ContextPart<typeof AVATAR_ROOT> {
    protected readonly contexts = AVATAR_ROOT;

    protected get avatar(): AvatarMachine {
        return this.provided[0].machine;
    }
}
