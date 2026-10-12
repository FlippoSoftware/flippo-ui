// biome-ignore-all lint/security/noSecrets: CSS selectors trigger the entropy heuristic.
/**
 * DOM helpers the styled packages share with the styles: behaviour that a class alone cannot give.
 */

/** Interactive descendants that keep their own press behaviour inside a control box. */
const INTERACTIVE = 'input, textarea, select, button, a[href], [contenteditable], [role="button"], [role="option"]';

/**
 * A press on a control box (the padding around an input, its icon) focuses the input inside, as if the whole box
 * were the field: the box is what looks like the field. A press before the text puts the caret at the start, after
 * it at the end, and the input gets the press (`mousedown`) as well.
 * Call it from the box's `mousedown` listener.
 */
export function focusControlOnPress(event: MouseEvent, box: Element): void {
    if (event.button !== 0 || event.defaultPrevented) {
        return;
    }
    const target = event.target as Element | null;
    if (target && target !== box && target.closest(INTERACTIVE)) {
        return;
    }
    const control = box.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea');
    if (!control || control.disabled) {
        return;
    }
    // Keeps the focus from moving to the box (or to nothing) before it reaches the input.
    event.preventDefault();
    control.focus();
    const { left, right } = control.getBoundingClientRect();
    if (event.clientX <= left) {
        setCaret(control, 0);
    } else if (event.clientX >= right) {
        setCaret(control, control.value.length);
    }
    // The control's own press handlers run as for a press on it (a combobox opens on a press on its input). The
    // repeated event targets the input, which this listener leaves alone.
    control.dispatchEvent(
        new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            button: 0,
            clientX: event.clientX,
            clientY: event.clientY,
            view: event.view
        })
    );
}

function setCaret(control: HTMLInputElement | HTMLTextAreaElement, position: number) {
    try {
        control.setSelectionRange(position, position);
    } catch {
        // Inputs such as `type="number"` or `"email"` have no selection.
    }
}
