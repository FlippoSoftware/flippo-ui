export {};

declare global {
    /**
     * Bundlers replace `process.env.NODE_ENV` at build time. Declared here so that the package
     * does not depend on Node.js typings.
     */
    var process: {
        env: {
            NODE_ENV?: string;
        };
    };

    /**
     * Provided by browsers, Node.js and other JavaScript runtimes.
     */
    function queueMicrotask(callback: () => void): void;

    /**
     * The console of the runtime (browsers, Node.js and other JavaScript runtimes all provide it).
     */
    var console: {
        error(...data: unknown[]): void;
        warn(...data: unknown[]): void;
    };
}
