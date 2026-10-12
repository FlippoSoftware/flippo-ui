import type { TooltipChangeEventDetails, TooltipPositionerMachine, TooltipRootMachine } from '@flippo-software/core-components/tooltip';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext } from '../../../lib/context';

import type { TooltipPositionerElement } from '../positioner/TooltipPositionerElement';
import type { TooltipProviderElement } from '../provider/TooltipProviderElement';

import type { TooltipElement } from './TooltipElement';

export type TooltipOpenChangeDetail = {
    open: boolean;
    reason: TooltipChangeEventDetails['reason'];
};

export const TooltipContext = createContext<TooltipElement>('tooltip');

export const TooltipPositionerContext = createContext<TooltipPositionerElement>('tooltip-positioner');

export const TooltipProviderContext = createContext<TooltipProviderElement>('tooltip-provider');

const TOOLTIP_ROOT = [TooltipContext] as const;

const TOOLTIP_ROOT_AND_POSITIONER = [TooltipContext, TooltipPositionerContext] as const;

export abstract class TooltipPart extends ContextPart<typeof TOOLTIP_ROOT> {
    protected readonly contexts = TOOLTIP_ROOT;

    protected get root(): TooltipRootMachine {
        return this.provided[0].machine;
    }
}

export abstract class TooltipPositionedPart extends ContextPart<typeof TOOLTIP_ROOT_AND_POSITIONER> {
    protected readonly contexts = TOOLTIP_ROOT_AND_POSITIONER;

    protected get root(): TooltipRootMachine {
        return this.provided[0].machine;
    }

    protected get positioner(): TooltipPositionerMachine {
        return this.provided[1].machine;
    }
}
