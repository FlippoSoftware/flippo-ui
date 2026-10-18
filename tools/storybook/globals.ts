import { addons } from '@storybook/preview-api';

/** The globals in the preview's address: Storybook passes `globals=locale:ru;theme:light` when they differ from the defaults. */
export function urlGlobals(): Record<string, string> {
    const globals = new URLSearchParams(window.location.search).get('globals') ?? '';
    return Object.fromEntries(
        globals
            .split(';')
            .filter(Boolean)
            .map((entry) => entry.split(':') as [string, string])
    );
}

/**
 * Calls `listener` with the globals at load (the address, over `initial`), then after every change in the toolbar
 * (`globalsUpdated`, which the preview sends with all of them). For what lives outside the stories, where no decorator
 * runs: the docs and MDX pages.
 */
export function followGlobals(initial: Record<string, unknown>, listener: (globals: Record<string, unknown>) => void): void {
    listener({ ...initial, ...urlGlobals() });
    addons.getChannel().on('globalsUpdated', ({ globals }: { globals?: Record<string, unknown> }) => {
        if (globals) listener(globals);
    });
}
