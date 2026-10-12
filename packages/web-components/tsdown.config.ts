import { defineConfig } from 'tsdown';

/**
 * Every component is an entry point of its own (`@flippo-software/web-components/dialog`), like in the other
 * component packages: importing one does not pull the others.
 */
const COMPONENTS = [
    'accordion',
    'autocomplete',
    'avatar',
    'button',
    'checkbox',
    'checkbox-card',
    'checkbox-group',
    'collapsible',
    'combobox',
    'context-menu',
    'dialog',
    'drawer',
    'field',
    'fieldset',
    'form',
    'marquee',
    'menu',
    'menubar',
    'meter',
    'navigation-menu',
    'number-field',
    'pin-input',
    'popover',
    'progress',
    'qr-code',
    'radio',
    'radio-card',
    'radio-group',
    'scroll-area',
    'segmented-control',
    'select',
    'separator',
    'slider',
    'snippet',
    'switch',
    'tabs',
    'toast',
    'toggle',
    'toggle-group',
    'toolbar',
    'tooltip'
];

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        ...Object.fromEntries(COMPONENTS.map((name) => [name, `src/components/${name}/index.ts`]))
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    platform: 'browser',
    deps: { neverBundle: [/^@flippo-software\//] },
    exports: true
});
