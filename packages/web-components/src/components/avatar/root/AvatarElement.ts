import { AvatarMachine } from '@flippo-software/core-components/avatar';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';

import { AvatarContext } from './AvatarRootContext';

/**
 * An image of a user, with a fallback while it loads or when it fails: the root of the `-avatar-*` parts.
 */
export class AvatarElement extends MachineElement.withAttributes({}) {
    readonly machine = new AvatarMachine();

    constructor() {
        super();
        declareProvider(this, AvatarContext);
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return provideContext(this, AvatarContext, this);
    }

    protected override getProps(): Props {
        return {};
    }
}
