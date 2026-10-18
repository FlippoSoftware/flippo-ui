import { followGlobals } from './globals';
import en from './i18n/en.json';
import ru from './i18n/ru.json';

/**
 * The languages of the Storybooks, English and Russian: the dictionaries `i18n/en.json` and `i18n/ru.json` hold the
 * same keys (`select.sections.sizes.title`, `common.cancel`, `docs.apiReference`, `api.Checkbox.Root.props.checked`).
 * The toolbar's `locale` global selects the language.
 */
export type Locale = 'en' | 'ru';

type Dictionary = { readonly [key: string]: string | Dictionary };

const dictionaries: Readonly<Record<Locale, Dictionary>> = { en, ru };

/** The text of a key in a language's dictionary, if it has one. */
export function lookup(locale: Locale, key: string): string | undefined {
    let node: string | Dictionary | undefined = dictionaries[locale];
    for (const part of key.split('.')) {
        if (typeof node !== 'object') return undefined;
        node = node[part];
    }
    return typeof node === 'string' ? node : undefined;
}

let current: Locale = 'en';
const listeners = new Set<() => void>();

export function getLocale(): Locale {
    return current;
}

export function subscribeLocale(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notifyAll() {
    for (const listener of listeners) listener();
}

/**
 * Sets the language. `notify: 'later'` from a decorator: the story it renders reads the new language at once, and
 * the other components (the docs page around it) update after that render, not in the middle of it.
 */
export function setLocale(locale: unknown, { notify = 'now' }: { notify?: 'now' | 'later' } = {}): void {
    const next: Locale = locale === 'ru' ? 'ru' : 'en';
    if (next === current) return;
    current = next;
    if (notify === 'now') notifyAll();
    else queueMicrotask(notifyAll);
}

/**
 * The text of a key in the current language (else in English, else the key itself). `{name}` placeholders take
 * `values`.
 *
 * @example t('pinInput.labels.digit', { number: 1 })
 */
export function t(key: string, values?: Readonly<Record<string, string | number>>): string {
    const text = lookup(current, key) ?? lookup('en', key) ?? key;
    return values ? text.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match)) : text;
}

let connected = false;

/**
 * Follows the `locale` global of the toolbar, for the docs and MDX pages (the decorators set it for the stories). Call
 * it once in the preview.
 */
export function connectLocale(): void {
    if (connected) return;
    connected = true;
    followGlobals({ locale: 'en' }, (globals) => {
        if ('locale' in globals) setLocale(globals.locale);
    });
}

/** The globals of the toolbar's language menu. */
export const localeGlobalType = {
    description: 'Language',
    toolbar: {
        icon: 'globe',
        items: [
            { value: 'en', title: 'English' },
            { value: 'ru', title: 'Русский' }
        ],
        dynamicTitle: true
    }
} as const;
