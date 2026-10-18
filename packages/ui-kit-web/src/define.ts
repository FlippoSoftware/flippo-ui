import type { ControlSize } from '@flippo-software/component-styles/sizes';
import type { ThemeSetting, Themes } from '@flippo-software/component-styles/theme';

import { elements as accordion } from './components/accordion';
import { elements as autocomplete } from './components/autocomplete';
import { elements as avatar } from './components/avatar';
import { elements as blockquote } from './components/blockquote';
import { elements as box } from './components/box';
import { elements as button } from './components/button';
import { elements as card } from './components/card';
import { elements as center } from './components/center';
import { elements as checkbox } from './components/checkbox';
import { elements as checkboxCard } from './components/checkbox-card';
import { elements as checkboxGroup } from './components/checkbox-group';
import { elements as code } from './components/code';
import { elements as collapsible } from './components/collapsible';
import { elements as combobox } from './components/combobox';
import { elements as container } from './components/container';
import { elements as contextMenu } from './components/context-menu';
import { elements as dialog } from './components/dialog';
import { elements as drawer } from './components/drawer';
import { elements as em } from './components/em';
import { elements as field } from './components/field';
import { elements as fieldset } from './components/fieldset';
import { elements as flex } from './components/flex';
import { elements as form } from './components/form';
import { elements as grid } from './components/grid';
import { elements as input } from './components/input';
import { elements as kbd } from './components/kbd';
import { elements as link } from './components/link';
import { elements as list } from './components/list';
import { elements as marquee } from './components/marquee';
import { elements as menu } from './components/menu';
import { elements as menubar } from './components/menubar';
import { elements as meter } from './components/meter';
import { elements as navigationMenu } from './components/navigation-menu';
import { elements as numberField } from './components/number-field';
import { elements as pinInput } from './components/pin-input';
import { elements as popover } from './components/popover';
import { elements as progress } from './components/progress';
import { elements as qrCode } from './components/qr-code';
import { elements as quote } from './components/quote';
import { elements as radio } from './components/radio';
import { elements as radioCard } from './components/radio-card';
import { elements as radioGroup } from './components/radio-group';
import { elements as scrollArea } from './components/scroll-area';
import { elements as section } from './components/section';
import { elements as segmentedControl } from './components/segmented-control';
import { elements as select } from './components/select';
import { elements as separator } from './components/separator';
import { elements as skeleton } from './components/skeleton';
import { elements as skeletonText } from './components/skeleton-text';
import { elements as slider } from './components/slider';
import { elements as slot } from './components/slot';
import { elements as snippet } from './components/snippet';
import { elements as spinner } from './components/spinner';
import { elements as strong } from './components/strong';
import { elements as switchElements } from './components/switch';
import { elements as tabs } from './components/tabs';
import { elements as text } from './components/text';
import { elements as textarea } from './components/textarea';
import { elements as toast } from './components/toast';
import { elements as toggle } from './components/toggle';
import { elements as toggleGroup } from './components/toggle-group';
import { elements as toolbar } from './components/toolbar';
import { elements as tooltip } from './components/tooltip';
import { DefaultPropsElement, setDefaultProps } from './lib/defaultProps';
import { ProviderElement, persistTheme, registerThemes, setControlSize, setTheme } from './lib/provider';
import { registerElements } from './lib/register';

import type { DefaultProps } from './lib/defaultProps';
import type { DefineOptions as RegisterOptions } from './lib/register';
export const components: {
    readonly skeletonText: typeof skeletonText;
    readonly accordion: typeof accordion;
    readonly autocomplete: typeof autocomplete;
    readonly avatar: typeof avatar;
    readonly blockquote: typeof blockquote;
    readonly box: typeof box;
    readonly button: typeof button;
    readonly card: typeof card;
    readonly center: typeof center;
    readonly checkbox: typeof checkbox;
    readonly checkboxCard: typeof checkboxCard;
    readonly checkboxGroup: typeof checkboxGroup;
    readonly code: typeof code;
    readonly collapsible: typeof collapsible;
    readonly combobox: typeof combobox;
    readonly container: typeof container;
    readonly contextMenu: typeof contextMenu;
    readonly dialog: typeof dialog;
    readonly drawer: typeof drawer;
    readonly em: typeof em;
    readonly field: typeof field;
    readonly fieldset: typeof fieldset;
    readonly flex: typeof flex;
    readonly form: typeof form;
    readonly grid: typeof grid;
    readonly input: typeof input;
    readonly kbd: typeof kbd;
    readonly link: typeof link;
    readonly list: typeof list;
    readonly marquee: typeof marquee;
    readonly menu: typeof menu;
    readonly menubar: typeof menubar;
    readonly meter: typeof meter;
    readonly navigationMenu: typeof navigationMenu;
    readonly numberField: typeof numberField;
    readonly pinInput: typeof pinInput;
    readonly popover: typeof popover;
    readonly progress: typeof progress;
    readonly qrCode: typeof qrCode;
    readonly quote: typeof quote;
    readonly radio: typeof radio;
    readonly radioCard: typeof radioCard;
    readonly radioGroup: typeof radioGroup;
    readonly scrollArea: typeof scrollArea;
    readonly section: typeof section;
    readonly segmentedControl: typeof segmentedControl;
    readonly select: typeof select;
    readonly separator: typeof separator;
    readonly skeleton: typeof skeleton;
    readonly slider: typeof slider;
    readonly snippet: typeof snippet;
    readonly spinner: typeof spinner;
    readonly strong: typeof strong;
    readonly switch: typeof switchElements;
    readonly tabs: typeof tabs;
    readonly text: typeof text;
    readonly textarea: typeof textarea;
    readonly toast: typeof toast;
    readonly toggle: typeof toggle;
    readonly toggleGroup: typeof toggleGroup;
    readonly toolbar: typeof toolbar;
    readonly tooltip: typeof tooltip;
    readonly slot: typeof slot;
} = {
    skeletonText,
    accordion,
    autocomplete,
    avatar,
    blockquote,
    box,
    button,
    card,
    center,
    checkbox,
    checkboxCard,
    checkboxGroup,
    code,
    collapsible,
    combobox,
    container,
    contextMenu,
    dialog,
    drawer,
    em,
    field,
    fieldset,
    flex,
    form,
    grid,
    input,
    kbd,
    link,
    list,
    marquee,
    menu,
    menubar,
    meter,
    navigationMenu,
    numberField,
    pinInput,
    popover,
    progress,
    qrCode,
    quote,
    radio,
    radioCard,
    radioGroup,
    scrollArea,
    section,
    segmentedControl,
    select,
    separator,
    skeleton,
    slider,
    snippet,
    spinner,
    strong,
    switch: switchElements,
    tabs,
    text,
    textarea,
    toast,
    toggle,
    toggleGroup,
    toolbar,
    tooltip,
    slot
} as const;
export type ComponentName = keyof typeof components;
export type DefineOptions = RegisterOptions & {
    components?: readonly ComponentName[];
    /** Default props of the families (see `DefaultProps`); `<prefix>-default-props` overrides them in its subtree. */
    defaults?: DefaultProps;
    /** The application's own themes with their colour schemes (`{ sepia: 'light' }`), see `registerThemes`. */
    themes?: Themes;
    /** The theme of the page (`setTheme`); `<prefix>-provider theme` sets a part's own. */
    theme?: ThemeSetting;
    /**
     * Keeps the page's theme in `localStorage` under this key and starts from it (else from `theme`); inline
     * `themeScript({ storageKey })` in the `<head>` with the same key.
     */
    storageKey?: string;
    /** The control size of the page (`setControlSize`); `<prefix>-provider size` sets a part's own. */
    size?: ControlSize;
};
export function define(options: DefineOptions) {
    if (options.defaults) setDefaultProps(options.defaults);
    if (options.themes) registerThemes(options.themes);
    if (options.storageKey !== undefined) persistTheme(options.storageKey, options.theme);
    else if (options.theme) setTheme(options.theme);
    if (options.size !== undefined) setControlSize(options.size);
    const selected = new Set(options.components ?? (Object.keys(components) as ComponentName[]));
    if (selected.has('autocomplete')) selected.add('combobox');
    if (selected.has('contextMenu') || selected.has('menubar')) selected.add('menu');
    for (const name of selected) {
        registerElements(
            name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
            components[name],
            options
        );
    }
    const registry = options.registry ?? customElements;
    const defaultPropsTag = `${options.prefix}-default-props`;
    if (!registry.get(defaultPropsTag)) registry.define(defaultPropsTag, class extends DefaultPropsElement {});
    const providerTag = `${options.prefix}-provider`;
    if (!registry.get(providerTag)) registry.define(providerTag, class extends ProviderElement {});
}
