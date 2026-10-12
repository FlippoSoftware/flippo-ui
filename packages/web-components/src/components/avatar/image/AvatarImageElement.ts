import { AvatarImageLoader } from '@flippo-software/core-components/avatar';

import type { AvatarImageOptions, ImageLoadingStatus } from '@flippo-software/core-components/avatar';
import type { Props } from '@flippo-software/core-components/props';

import { PropsApplier } from '../../../lib/PropsApplier';
import { AvatarPart } from '../root/AvatarRootContext';

/**
 * The image, shown once it has loaded. As the element itself, it shows an `<img part="image">` from its shadow root
 * (style it with `::part(image)`); with `as-child`, the props go to your `<img>`.
 *
 * Attributes: `src`, `alt`, `referrer-policy`, `cross-origin`.
 * Events: `loading-status-change` (`detail: { status }`: `loading`, `loaded`, `error`).
 */
export class AvatarImageElement extends AvatarPart.withAttributes({
    src: 'string',
    alt: 'string',
    'referrer-policy': 'string',
    'cross-origin': ['anonymous', 'use-credentials', '']
}) {
    private loader!: AvatarImageLoader;

    private image: HTMLImageElement | null = null;

    private readonly imageApplier = new PropsApplier();

    protected override createParts() {
        this.loader = new AvatarImageLoader(this.avatar, this.getOptions());
    }

    protected override applyOptions() {
        this.loader.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return this.loader.connect();
    }

    protected override getProps(target: HTMLElement): Props {
        const loaded = this.loader.store.state.status === 'loaded';
        const imageProps = {
            src: loaded ? this.src : undefined,
            alt: this.alt ?? '',
            referrerPolicy: this.referrerPolicy,
            crossOrigin: this.crossOrigin
        };
        if (target === this) {
            this.imageApplier.apply(this.getImage(), imageProps);
            return { hidden: !loaded };
        }
        return { ...imageProps, hidden: !loaded };
    }

    /**
     * The image of the host mode, in the shadow root.
     */
    private getImage(): HTMLImageElement {
        if (!this.image) {
            const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
            this.image = this.ownerDocument.createElement('img');
            this.image.setAttribute('part', 'image');
            root.append(this.image);
        }
        return this.image;
    }

    private getOptions(): AvatarImageOptions {
        return {
            src: this.src,
            referrerPolicy: this.referrerPolicy as ReferrerPolicy | undefined,
            crossOrigin: this.crossOrigin,
            onLoadingStatusChange: (status: ImageLoadingStatus) => {
                this.emit('loading-status-change', { status });
            }
        };
    }
}
