/**
 * Bundlers replace `process.env.NODE_ENV` at build time. Declared here so that the package does not depend on
 * Node.js typings.
 */
declare const process: {
    env: {
        NODE_ENV?: string;
    };
};
