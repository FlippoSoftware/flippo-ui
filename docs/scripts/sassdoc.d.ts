/** The part of SassDoc's API the generators use (it has no types of its own). */
declare module 'sassdoc' {
    const sassdoc: {
        /** The documented items of the SCSS files of a folder. */
        parse(source: string, config?: { verbose?: boolean }): Promise<unknown[]>;
    };
    // biome-ignore lint/style/noDefaultExport: the shape of the package (a CommonJS module).
    export default sassdoc;
}
