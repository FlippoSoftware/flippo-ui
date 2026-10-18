import * as React from 'react';

import { Markdown } from '@storybook/blocks';

import { getLocale, subscribeLocale } from './i18n';

import type { Locale } from './i18n';

/** The current language, re-rendering when it changes. */
export function useLocale(): Locale {
    return React.useSyncExternalStore(subscribeLocale, getLocale, getLocale);
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;
const TITLE = /^title:\s*(.+)$/m;
const SLOT = /^<!-- slot:([\w-]+) -->$/m;

/** The title of a document's frontmatter (`title: "Tokens"`). */
function titleOf(frontmatter: string): string | undefined {
    const value = frontmatter.match(TITLE)?.[1]?.trim();
    return value?.startsWith('"') ? (JSON.parse(value) as string) : value;
}

/**
 * A page written as one markdown document per language (`introduction.md`, `introduction.ru.md`, imported with
 * `?raw`), for MDX pages: the document of the current language, its frontmatter `title` as the heading. A
 * `<!-- slot:<name> -->` line of the documents shows the element `slots[name]` there (a palette, a live example).
 */
export function MarkdownPage({
    en,
    ru,
    slots = {}
}: {
    en: string;
    ru: string;
    slots?: Record<string, React.ReactNode>;
}): React.JSX.Element {
    const source = useLocale() === 'ru' ? ru : en;
    const title = titleOf(source.match(FRONTMATTER)?.[1] ?? '');
    // Text and slot names alternate: [text, name, text, name, text…]. A text is keyed by the slot before it.
    const [first = '', ...rest] = source.replace(FRONTMATTER, '').split(SLOT);
    const slotted = Array.from({ length: rest.length / 2 }, (_, index) => ({
        name: rest[index * 2] ?? '',
        text: rest[index * 2 + 1] ?? ''
    }));
    return (
        <>
            {title ? <Markdown>{`# ${title}`}</Markdown> : null}
            <Markdown>{first}</Markdown>
            {slotted.map(({ name, text }) => (
                <React.Fragment key={name}>
                    {slots[name]}
                    <Markdown>{text}</Markdown>
                </React.Fragment>
            ))}
        </>
    );
}
