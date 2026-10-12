/**
 * Render modes every component test runs in: React StrictMode mounts, unmounts and mounts again,
 * which is what the core machines' `connect()`/`disconnect()` must survive.
 */
export const RENDER_MODES = [
    { name: 'default', reactStrictMode: false },
    { name: 'StrictMode', reactStrictMode: true }
] as const;
