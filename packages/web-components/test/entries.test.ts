import { describe, expect, it } from 'vitest';

import { components } from '../src';
import { define as defineAutocomplete } from '../src/components/autocomplete';
import { define as defineDialog, elements as dialog } from '../src/components/dialog';

describe('entry points', () => {
    it('registers only its component', () => {
        defineDialog({ prefix: 'only' });
        expect(customElements.get('only-dialog')).toBeDefined();
        expect(customElements.get('only-dialog-popup')).toBeDefined();
        expect(customElements.get('only-popover')).toBeUndefined();
        expect(dialog.root).toBe(components.dialog.root);
    });

    it('registers the components it is built on', () => {
        defineAutocomplete({ prefix: 'auto' });
        expect(customElements.get('auto-autocomplete')).toBeDefined();
        expect(customElements.get('auto-combobox-input')).toBeDefined();
    });
});
