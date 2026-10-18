import { create } from '@storybook/theming/create';

/**
 * The Storybook theme of both UI kits (manager and docs pages): the Flippo dark palette of
 * `component-styles/scss/tokens/_color.scss` (neutral and brand steps) and the Flippo UI logo (`assets/`).
 */
export function flippoTheme(kit: 'React' | 'Web Components') {
    return create({
        base: 'dark',
        brandTitle: `Flippo UI · ${kit}`,
        brandImage: 'flippo/logo.svg',
        brandUrl: 'https://github.com/FlippoSoftware/flippo-ui',
        brandTarget: '_blank',

        colorPrimary: '#a073fb', // brand-25
        colorSecondary: '#9265ed', // brand-30

        appBg: '#14151a', // neutral-10, bg-0
        appContentBg: '#1f2129', // neutral-16, bg-1
        appPreviewBg: '#14151a',
        appBorderColor: '#313440', // neutral-25
        appBorderRadius: 16,

        barBg: '#1f2129',
        barTextColor: '#a5a7b3', // neutral-70, text-3
        barSelectedColor: '#a073fb',
        barHoverColor: '#a073fb',

        textColor: '#e1e2e5', // neutral-90
        textMutedColor: '#878a99', // neutral-60, text-4
        textInverseColor: '#14151a',

        inputBg: '#23252e', // neutral-18, bg-2
        inputBorder: '#313440',
        inputTextColor: '#e1e2e5',
        inputBorderRadius: 12,

        fontBase: "'Vela Sans', -apple-system, 'Segoe UI', Roboto, sans-serif",
        fontCode: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    });
}

/** `staticDirs` entry that serves the logo and the favicon at `flippo/`. */
export const brandAssets = {
    from: '../../../tools/storybook/assets',
    to: '/flippo'
};
