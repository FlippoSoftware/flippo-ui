import { applyStyle, isSafari, visuallyHidden } from '@flippo-software/core-components/lib';
import { effect, untracked } from '@flippo-software/store';

import type { FocusManager } from '@flippo-software/core-components/floating';

/**
 * The focus guards of a `FocusManager`, in the shadow root of an element, around its content (`<slot>`): when Tab
 * reaches one, the focus manager moves the focus (to the other end of a modal popup, for instance).
 *
 * In the shadow root, the guards never mix with the content, which belongs to the page or to a framework.
 */
export class FocusGuards {
    private readonly before: HTMLSpanElement;

    private readonly after: HTMLSpanElement;

    private focusManager: FocusManager | null = null;

    constructor(root: ShadowRoot) {
        this.before = createGuard(root.ownerDocument ?? document);
        this.after = createGuard(root.ownerDocument ?? document);
        const slot = (root.ownerDocument ?? document).createElement('slot');
        root.append(this.before, slot, this.after);

        this.before.addEventListener('focus', (event) => this.focusManager?.onBeforeGuardFocus(event));
        this.after.addEventListener('focus', (event) => this.focusManager?.onAfterGuardFocus(event));
    }

    /**
     * Lets `focusManager` use the guards while it needs them. Returns a function that detaches it.
     */
    attach(focusManager: FocusManager): () => void {
        this.focusManager = focusManager;
        const stop = effect(() => {
            const shown = focusManager.shouldRenderGuards();
            untracked(() => this.show(focusManager, shown));
        });
        return () => {
            stop();
            this.show(focusManager, false);
            this.focusManager = null;
        };
    }

    private show(focusManager: FocusManager, shown: boolean) {
        for (const guard of [this.before, this.after]) {
            guard.hidden = !shown;
            guard.tabIndex = shown ? 0 : -1;
        }
        focusManager.setBeforeGuard(shown ? this.before : null);
        focusManager.setAfterGuard(shown ? this.after : null);
    }
}

function createGuard(document: Document): HTMLSpanElement {
    const guard = document.createElement('span');
    guard.setAttribute('data-base-ui-focus-guard', '');
    guard.setAttribute('data-type', 'inside');
    if (isSafari) {
        // VoiceOver only focuses buttons: the role lets the guard catch its virtual cursor.
        guard.setAttribute('role', 'button');
    } else {
        guard.setAttribute('aria-hidden', 'true');
    }
    applyStyle(guard, visuallyHidden);
    guard.hidden = true;
    guard.tabIndex = -1;
    return guard;
}
