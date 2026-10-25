import assert from 'node:assert/strict';
import { test } from 'node:test';

import { coreEnumOf, registeredWebParts } from './core-enums.ts';

const enums = Object.fromEntries(
    [
        'CheckboxRootDataAttributes',
        'PinInputDataAttributes',
        'FieldControlDataAttributes',
        'ButtonDataAttributes',
        'ComboboxInputDataAttributes',
        'ComboboxItemIndicatorDataAttributes',
        // biome-ignore lint/security/noSecrets: the name of a core enum, not a secret.
        'ComboboxItemIndicatorWebDataAttributes',
        'ComboboxPositionerCssVars',
        'NavigationMenuRootDataAttributes',
        'NavigationMenuRootWebDataAttributes',
        'ScrollAreaRootDataAttributes'
    ].map((name) => [name, []])
);

test('resolves named roots and single-component enums without hiding missing part enums', () => {
    assert.equal(coreEnumOf(enums, 'checkbox', 'root', 'DataAttributes'), 'CheckboxRootDataAttributes');
    assert.equal(coreEnumOf(enums, 'pin-input', 'root', 'DataAttributes'), 'PinInputDataAttributes');
    assert.equal(coreEnumOf(enums, 'checkbox', 'indicator', 'DataAttributes'), undefined);
    assert.equal(coreEnumOf(enums, 'new-component', 'root', 'DataAttributes'), undefined);
});

test('uses the real React function for re-exports and the same explicit web aliases', () => {
    assert.equal(
        coreEnumOf(enums, 'Autocomplete', 'Input', 'DataAttributes', { adapter: 'react', componentName: 'ComboboxInput' }),
        'ComboboxInputDataAttributes'
    );
    assert.equal(coreEnumOf(enums, 'autocomplete', 'input', 'DataAttributes'), 'ComboboxInputDataAttributes');
    assert.equal(
        coreEnumOf(enums, 'Textarea', 'Textarea', 'DataAttributes', { adapter: 'react', componentName: 'Textarea' }),
        'FieldControlDataAttributes'
    );
    assert.equal(coreEnumOf(enums, 'autocomplete', 'positioner', 'CssVars'), 'ComboboxPositionerCssVars');
    assert.equal(coreEnumOf(enums, 'input', 'root', 'CssVars'), undefined);
});

test('preserves adapter differences instead of borrowing attributes that an element never emits', () => {
    assert.equal(coreEnumOf(enums, 'combobox', 'chip', 'DataAttributes'), undefined);
    assert.equal(coreEnumOf(enums, 'combobox', 'chip', 'DataAttributes', { adapter: 'react' }), 'ButtonDataAttributes');
    // biome-ignore lint/security/noSecrets: the name of a core enum, not a secret.
    assert.equal(coreEnumOf(enums, 'combobox', 'itemIndicator', 'DataAttributes'), 'ComboboxItemIndicatorWebDataAttributes');
    assert.equal(coreEnumOf(enums, 'select', 'itemIndicator', 'DataAttributes'), 'ComboboxItemIndicatorDataAttributes');
    assert.equal(coreEnumOf(enums, 'navigation-menu', 'root', 'DataAttributes'), 'NavigationMenuRootWebDataAttributes');
    assert.equal(coreEnumOf(enums, 'navigation-menu', 'root', 'DataAttributes', { adapter: 'react' }), 'NavigationMenuRootDataAttributes');
    assert.equal(coreEnumOf(enums, 'scroll-area', 'corner', 'DataAttributes'), 'ScrollAreaRootDataAttributes');
    assert.equal(coreEnumOf(enums, 'scroll-area', 'corner', 'DataAttributes', { adapter: 'react' }), undefined);
});

test('reads every explicit registration and rejects unsupported values rather than dropping parts', () => {
    const manifest = {
        modules: [
            { path: 'src/components/button/index.ts', declarations: [{ name: 'elements', default: 'ButtonElement' }] },
            {
                path: 'src/components/menu/index.ts',
                declarations: [{ name: 'elements', default: '{ root: MenuElement, item: MenuItemElement, }' }]
            }
        ]
    };
    assert.deepEqual(registeredWebParts(manifest), [
        { family: 'button', part: 'root', className: 'ButtonElement' },
        { family: 'menu', part: 'root', className: 'MenuElement' },
        { family: 'menu', part: 'item', className: 'MenuItemElement' }
    ]);
    for (const value of ['', '{}', '{ ...shared, root: RootElement }', 'makeElements()']) {
        assert.throws(
            () =>
                registeredWebParts({
                    modules: [{ path: 'src/components/example/index.ts', declarations: [{ name: 'elements', default: value }] }]
                }),
            /cannot read registered elements of example/
        );
    }
});
