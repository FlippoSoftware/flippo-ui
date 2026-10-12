/** The custom export condition of the workspace packages' sources (`devExports: 'source'` in their tsdown config). */
export declare const SOURCE_CONDITION = "source";
/** Vite's default conditions, after the source condition: browser code (Storybook, Vitest with a DOM). */
export declare const clientConditions: string[];
/** Vite's default conditions, after the source condition: code run by Node (Vitest's SSR transforms). */
export declare const serverConditions: string[];
/**
 * The stylesheet of the kits (`component-styles/css/index.css`, built from SCSS) mapped to its SCSS source: Vite
 * compiles it and reloads it on change.
 */
export declare const stylesAliases: {
    find: RegExp;
    replacement: string;
}[];
//# sourceMappingURL=workspace.d.ts.map