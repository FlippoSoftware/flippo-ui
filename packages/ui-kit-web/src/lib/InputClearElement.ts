import { ButtonElement } from '@flippo-software/web-components/button';

/** Clears through the native input event, so the existing Field machine owns value and validation. */
export class InputClearBaseElement extends ButtonElement {
    protected override getProps() {
        const props = super.getProps();
        return {
            ...props,
            type: 'button',
            'aria-label': this.getAttribute('aria-label') ?? 'Clear input',
            onClick: (event: MouseEvent) => {
                (props.onClick as ((event: MouseEvent) => void) | undefined)?.(event);
                if (event.defaultPrevented || this.disabled) return;
                const input = this.closest('.fl-input-root')?.querySelector('input');
                if (!input) return;
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, '');
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.focus();
            }
        };
    }
}
