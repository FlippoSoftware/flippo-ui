import { AvatarFallbackDelay } from '@flippo-software/core-components/avatar';

import type { Props } from '@flippo-software/core-components/props';

import { AvatarPart } from '../root/AvatarRootContext';

/**
 * Shown while the image is not loaded (after `delay` ms, if set).
 *
 * Attributes: `delay`.
 */
export class AvatarFallbackElement extends AvatarPart.withAttributes({
    /** How long to wait before showing the fallback. Specified in milliseconds. */
    delay: 'number'
}) {
    private fallbackDelay!: AvatarFallbackDelay;

    protected override createParts() {
        this.fallbackDelay = new AvatarFallbackDelay(this.delay);
    }

    protected override applyOptions() {
        this.fallbackDelay.setOptions({ delay: this.delay });
    }

    protected override connectParts() {
        return this.fallbackDelay.connect();
    }

    protected override getProps(): Props {
        return { hidden: !this.fallbackDelay.isRendered(this.avatar.store.state.imageLoadingStatus) };
    }
}
