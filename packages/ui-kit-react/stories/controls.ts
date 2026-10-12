export function variantControls(recipe: { readonly variantOptions: Readonly<Record<string, readonly unknown[]>> }) {
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
