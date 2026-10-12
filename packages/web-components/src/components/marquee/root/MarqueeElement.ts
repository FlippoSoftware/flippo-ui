import { getStyleHookProps } from '@flippo-software/core-components/attributes';
import { MarqueeMachine } from '@flippo-software/core-components/marquee';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MarqueeOptions } from '@flippo-software/core-components/marquee';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement } from '../../../lib/MachineElement';

import { MarqueeContext } from './MarqueeRootContext';

/**
 * Content scrolling continuously (a ticker, logos): the root of the `-marquee-*` parts. Animate the track with the
 * CSS variables of the root, e.g. `animation: marquee var(--marquee-duration) linear var(--marquee-iteration-count)
 * var(--marquee-play)` with `@keyframes marquee { to { transform: translateX(-50%) } }`: the track holds its content
 * twice (or more, with `auto-fill`).
 *
 * Attributes: `play` (`"false"` pauses it), `pause-on-hover` (on by default), `pause-on-click`, `orientation`
 * (`horizontal` by default, `vertical`), `direction` (`normal`, `reverse`), `speed` (px/s; 50), `delay` (s), `loop`
 * (cycles; 0: forever), `auto-fill` (repeats the content to fill the root; on by default).
 * Events: `cycle-complete`, `finish`.
 * State attributes: `data-playing`, `data-orientation`, `data-direction`.
 */
export class MarqueeElement extends MachineElement.withAttributes({
    play: 'boolean',
    'pause-on-hover': 'boolean',
    'pause-on-click': 'boolean',
    orientation: ['horizontal', 'vertical'],
    direction: ['normal', 'reverse'],
    speed: 'number',
    delay: 'number',
    loop: 'number',
    'auto-fill': 'boolean'
}) {
    private marquee!: MarqueeMachine;

    constructor() {
        super();
        declareProvider(this, MarqueeContext);
    }

    get machine(): MarqueeMachine {
        return this.marquee;
    }

    protected override createParts() {
        this.marquee = new MarqueeMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.marquee.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.marquee.connect();
        const stopProviding = provideContext(this, MarqueeContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.marquee?.setRoot(element);
    }

    protected override getProps(): Props {
        return mergeProps({ style: this.marquee.getRootStyle() }, getStyleHookProps(this.marquee.getState()));
    }

    private getOptions(): MarqueeOptions {
        return {
            play: this.play ?? true,
            pauseOnHover: this.pauseOnHover ?? true,
            pauseOnClick: this.pauseOnClick ?? false,
            orientation: this.orientation ?? 'horizontal',
            direction: this.direction ?? 'normal',
            speed: this.speed ?? 50,
            delay: this.delay ?? 0,
            loop: this.loop ?? 0,
            autoFill: this.autoFill ?? true
        };
    }
}
