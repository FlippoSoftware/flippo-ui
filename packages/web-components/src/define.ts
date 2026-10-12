import { elements as accordionElements } from './components/accordion';
import { elements as autocompleteElements } from './components/autocomplete';
import { elements as avatarElements } from './components/avatar';
import { elements as buttonElements } from './components/button';
import { elements as checkboxElements } from './components/checkbox';
import { elements as checkboxCardElements } from './components/checkbox-card';
import { elements as checkboxGroupElements } from './components/checkbox-group';
import { elements as collapsibleElements } from './components/collapsible';
import { elements as comboboxElements } from './components/combobox';
import { elements as contextMenuElements } from './components/context-menu';
import { elements as dialogElements } from './components/dialog';
import { elements as drawerElements } from './components/drawer';
import { elements as fieldElements } from './components/field';
import { elements as fieldsetElements } from './components/fieldset';
import { elements as formElements } from './components/form';
import { elements as marqueeElements } from './components/marquee';
import { elements as menuElements } from './components/menu';
import { elements as menubarElements } from './components/menubar';
import { elements as meterElements } from './components/meter';
import { elements as navigationMenuElements } from './components/navigation-menu';
import { elements as numberFieldElements } from './components/number-field';
import { elements as pinInputElements } from './components/pin-input';
import { elements as popoverElements } from './components/popover';
import { elements as progressElements } from './components/progress';
import { elements as qrCodeElements } from './components/qr-code';
import { elements as radioElements } from './components/radio';
import { elements as radioCardElements } from './components/radio-card';
import { elements as radioGroupElements } from './components/radio-group';
import { elements as scrollAreaElements } from './components/scroll-area';
import { elements as segmentedControlElements } from './components/segmented-control';
import { elements as selectElements } from './components/select';
import { elements as separatorElements } from './components/separator';
import { elements as sliderElements } from './components/slider';
import { elements as snippetElements } from './components/snippet';
import { elements as switchElements } from './components/switch';
import { elements as tabsElements } from './components/tabs';
import { elements as toastElements } from './components/toast';
import { elements as toggleElements } from './components/toggle';
import { elements as toggleGroupElements } from './components/toggle-group';
import { elements as toolbarElements } from './components/toolbar';
import { elements as tooltipElements } from './components/tooltip';
import { registerElements } from './lib/registerElements';

import type { DefineOptions as RegisterOptions } from './lib/registerElements';

/**
 * The element classes, grouped like the parts of the headless components (`Collapsible.Trigger` →
 * `components.collapsible.trigger`). Register them with {@link define}, or with `customElements.define` under any
 * names. Each component also has its own entry point (`@flippo-software/web-components/collapsible`) with its
 * `elements` and a `define` that registers only it.
 */
export const components = {
    accordion: accordionElements,
    autocomplete: autocompleteElements,
    avatar: avatarElements,
    button: buttonElements,
    checkbox: checkboxElements,
    checkboxCard: checkboxCardElements,
    checkboxGroup: checkboxGroupElements,
    collapsible: collapsibleElements,
    combobox: comboboxElements,
    contextMenu: contextMenuElements,
    dialog: dialogElements,
    drawer: drawerElements,
    field: fieldElements,
    fieldset: fieldsetElements,
    form: formElements,
    marquee: marqueeElements,
    menu: menuElements,
    menubar: menubarElements,
    meter: meterElements,
    navigationMenu: navigationMenuElements,
    numberField: numberFieldElements,
    pinInput: pinInputElements,
    popover: popoverElements,
    progress: progressElements,
    qrCode: qrCodeElements,
    radio: radioElements,
    radioCard: radioCardElements,
    radioGroup: radioGroupElements,
    scrollArea: scrollAreaElements,
    segmentedControl: segmentedControlElements,
    select: selectElements,
    separator: separatorElements,
    slider: sliderElements,
    snippet: snippetElements,
    switch: switchElements,
    tabs: tabsElements,
    toast: toastElements,
    toggle: toggleElements,
    toggleGroup: toggleGroupElements,
    toolbar: toolbarElements,
    tooltip: tooltipElements
} as const;

export type ComponentName = keyof typeof components;

export type DefineOptions = RegisterOptions & {
    /**
     * The components to register (all by default).
     */
    components?: readonly ComponentName[] | undefined;
};

/**
 * Registers the elements as `<prefix>-<part>` tags. Registering a name twice is ignored, so it can be called by
 * several modules.
 *
 * @example
 * define({ prefix: 'ui' });
 * // <ui-collapsible><ui-collapsible-trigger>…</ui-collapsible-trigger><ui-collapsible-panel>…</ui-collapsible-panel></ui-collapsible>
 */
export function define(options: DefineOptions) {
    const selected = options.components ?? (Object.keys(components) as ComponentName[]);
    for (const component of selected) {
        registerElements(component, components[component], options);
    }
}
