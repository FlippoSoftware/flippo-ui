type Recipe = ((props: never) => unknown) & { readonly variantOptions: Readonly<Record<string, readonly unknown[]>> };
export type VariantProps<R extends Recipe> = Partial<Omit<NonNullable<Parameters<R>[0]>, 'className' | 'classNames'>>;
export function variantControls(recipe: Pick<Recipe, 'variantOptions'>) {
    return Object.fromEntries(
        Object.entries(recipe.variantOptions).map(([name, values]) => [
            name,
            {
                control: values.every((value) => value === 'true' || value === 'false' || typeof value === 'boolean')
                    ? ('boolean' as const)
                    : ('select' as const),
                options: values,
                table: { category: 'Style variants' }
            }
        ])
    );
}
/** Markup is a source-code constant. Storybook args are applied as attributes, never interpolated as HTML. */
export function renderExample(markup: string, args: Record<string, unknown>, configure?: (root: HTMLElement) => void): HTMLElement {
    const root = document.createElement('div');
    root.className = 'story-example';
    root.innerHTML = markup;
    const targets = [...root.querySelectorAll('[data-story-target]')];
    // Toast uses an inert template that is cloned by its viewport after clicking the trigger.
    for (const template of root.querySelectorAll('template')) targets.push(...template.content.querySelectorAll('[data-story-target]'));
    for (const target of targets) {
        applyArgs(target, args);
        if (typeof args.disabled === 'boolean') applyDisabled(target, args.disabled);
    }
    configure?.(root);
    return root;
}

function applyArgs(target: Element, args: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(args)) {
        if (value === undefined) continue;
        const name = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        // A boolean attribute is on while present, whatever its value: `false` removes it.
        if (value === null || value === false) target.removeAttribute(name);
        else target.setAttribute(name, value === true ? '' : String(value));
    }
}

/**
 * Presentation shells (an input box) are not disabled themselves: the field controls inside them own the state, and
 * the native controls follow.
 */
function applyDisabled(target: Element, disabled: boolean): void {
    for (const control of target.querySelectorAll('demo-input-control, demo-textarea-control')) {
        control.toggleAttribute('disabled', disabled);
    }
    for (const control of target.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')) control.disabled = disabled;
}
