import { NavigationMenuPositionerMachine, NavigationMenuRootMachine } from '@flippo-software/core-components/navigation-menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { NavigationMenuChangeEventDetails, NavigationMenuRootOptions } from '@flippo-software/core-components/navigation-menu';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement } from '../../../lib/MachineElement';

import { NavigationMenuContext, type NavigationMenuValueChangeDetail } from './NavigationMenuRootContext';

/**
 * A navigation bar whose items open panels of links: the root of the `-navigation-menu-*` parts.
 *
 * Each item's content is shown in the top layer, positioned against its trigger, where it is in the document (it is
 * not moved into a shared viewport): style the contents as the popup.
 *
 * Attributes: `value` (controlled: the open item; `""` for none), `default-value`, `delay` (ms before opening on
 * hover; 50), `close-delay` (50), `orientation` (`horizontal` by default, `vertical`); positioning of the contents:
 * `side` (`bottom`), `align` (`center`), `side-offset`, `align-offset`, `collision-padding` (5), `position-method`
 * (`fixed` by default).
 * Events: `value-change` (cancelable; `detail: { value, reason }`), `open-change-complete` (`detail: { open }`).
 * State attributes: `data-open`/`data-closed`.
 */
export class NavigationMenuElement extends MachineElement.withAttributes({
    value: 'string',
    'default-value': 'string',
    delay: 'number',
    'close-delay': 'number',
    orientation: ['horizontal', 'vertical'],
    side: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    align: ['start', 'center', 'end'],
    'side-offset': 'number',
    'align-offset': 'number',
    'collision-padding': 'number',
    'position-method': ['fixed', 'absolute']
}) {
    private root!: NavigationMenuRootMachine;

    private positionerMachine!: NavigationMenuPositionerMachine;

    constructor() {
        super();
        declareProvider(this, NavigationMenuContext);
    }

    get machine(): NavigationMenuRootMachine {
        return this.root;
    }

    /**
     * Positions the open content against its trigger.
     */
    get positioner(): NavigationMenuPositionerMachine {
        return this.positionerMachine;
    }

    protected override createParts() {
        this.root = new NavigationMenuRootMachine(this.getOptions(), { nodeId: createId('navigation-menu-node'), parent: null });
        this.positionerMachine = new NavigationMenuPositionerMachine(this.root, this.getPositionerOptions());
    }

    protected override applyOptions() {
        this.root.setOptions(this.getOptions());
        this.positionerMachine.setOptions(this.getPositionerOptions());
    }

    protected override afterOptions() {
        this.root.afterCommit();
        this.positionerMachine.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.root.connect();
        const disconnectPositioner = this.positionerMachine.connect();
        const stopProviding = provideContext(this, NavigationMenuContext, this);
        return () => {
            stopProviding();
            disconnectPositioner();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.root?.setRootElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.root.getRootProps(), this.root.open ? { 'data-open': '' } : { 'data-closed': '' });
    }

    private getOptions(): NavigationMenuRootOptions {
        const { value } = this;
        return {
            value: value === undefined ? undefined : value === '' ? null : value,
            defaultValue: this.defaultValue ?? null,
            delay: this.delay ?? 50,
            closeDelay: this.closeDelay ?? 50,
            orientation: this.orientation ?? 'horizontal',
            onValueChange: (next: unknown, eventDetails: NavigationMenuChangeEventDetails) => {
                this.emit(
                    'value-change',
                    { value: next, reason: eventDetails.reason } satisfies NavigationMenuValueChangeDetail,
                    eventDetails
                );
            },
            onOpenChangeComplete: (open: boolean) => {
                this.emit('open-change-complete', { open });
            }
        };
    }

    private getPositionerOptions() {
        return {
            side: this.side ?? 'bottom',
            align: this.align ?? 'center',
            sideOffset: this.sideOffset ?? 0,
            alignOffset: this.alignOffset ?? 0,
            collisionBoundary: 'clipping-ancestors' as const,
            collisionPadding: this.collisionPadding ?? 5,
            positionMethod: this.positionMethod ?? 'fixed',
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? ('rtl' as const) : ('ltr' as const)
        };
    }
}
