import type { CollapsibleChangeEventDetails, CollapsibleMachine } from '@flippo-software/core-components/collapsible';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

export type CollapsibleOpenChangeDetail = {
    open: boolean;
    reason: CollapsibleChangeEventDetails['reason'];
};

export const CollapsibleContext = createContext<CollapsibleMachine>('collapsible');

/**
 * Base of the parts of a collapsible: they need the root's machine.
 */
const COLLAPSIBLE = [CollapsibleContext] as const;

export abstract class CollapsiblePart extends ContextPart<typeof COLLAPSIBLE> {
    protected readonly contexts = COLLAPSIBLE;

    protected get collapsible(): CollapsibleMachine {
        return this.provided[0];
    }
}
