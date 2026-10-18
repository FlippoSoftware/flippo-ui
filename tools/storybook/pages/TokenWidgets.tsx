/**
 * The live parts of the tokens page (`pages/Tokens.mdx`): the colour palette and the text styles, in the current theme
 * and language.
 */
// biome-ignore lint/style/useImportType: the MDX pages compile JSX to `React.createElement`.
import * as React from 'react';

import { ColorItem, ColorPalette } from '@storybook/blocks';

import { t } from '../i18n';
import { useLocale } from '../Lang';

/** The semantic colours of the current theme, by role. */
export function Palette(): React.JSX.Element {
    useLocale();
    return (
        <ColorPalette>
            <ColorItem
                title={t('pages.tokens.colors.brand')}
                subtitle='--fl-color-*'
                colors={{
                    'brand-dark-subtle': 'var(--fl-color-brand-dark-subtle)',
                    brand: 'var(--fl-color-brand)',
                    'brand-light-subtle': 'var(--fl-color-brand-light-subtle)',
                    'brand-hover': 'var(--fl-color-brand-hover)',
                    'brand-light': 'var(--fl-color-brand-light)',
                    'brand-light-hover': 'var(--fl-color-brand-light-hover)',
                    'brand-disabled': 'var(--fl-color-brand-disabled)'
                }}
            />
            <ColorItem
                title={t('pages.tokens.colors.surfaces')}
                subtitle='--fl-color-*'
                colors={{
                    'bg-0': 'var(--fl-color-bg-0)',
                    'bg-area-muted': 'var(--fl-color-bg-area-muted)',
                    'bg-area-subtle': 'var(--fl-color-bg-area-subtle)',
                    'bg-area': 'var(--fl-color-bg-area)',
                    'bg-1': 'var(--fl-color-bg-1)',
                    'bg-1-hover': 'var(--fl-color-bg-1-hover)',
                    'bg-2': 'var(--fl-color-bg-2)',
                    'bg-2-hover': 'var(--fl-color-bg-2-hover)',
                    'bg-3': 'var(--fl-color-bg-3)',
                    'bg-3-alt': 'var(--fl-color-bg-3-alt)',
                    'bg-3-hover': 'var(--fl-color-bg-3-hover)'
                }}
            />
            <ColorItem
                title={t('pages.tokens.colors.text')}
                subtitle='--fl-color-*'
                colors={{
                    'text-white': 'var(--fl-color-text-white)',
                    'text-primary': 'var(--fl-color-text-primary)',
                    'text-2': 'var(--fl-color-text-2)',
                    'text-3': 'var(--fl-color-text-3)',
                    'text-4': 'var(--fl-color-text-4)',
                    'text-5': 'var(--fl-color-text-5)',
                    'text-6': 'var(--fl-color-text-6)',
                    'text-disabled': 'var(--fl-color-text-disabled)',
                    'text-strong': 'var(--fl-color-text-strong)'
                }}
            />
            <ColorItem
                title={t('pages.tokens.colors.strokes')}
                subtitle='--fl-color-*'
                colors={{
                    stroke: 'var(--fl-color-stroke)',
                    'stroke-hover': 'var(--fl-color-stroke-hover)',
                    'stroke-subtle': 'var(--fl-color-stroke-subtle)',
                    'stroke-transparent': 'var(--fl-color-stroke-transparent)',
                    'stroke-muted': 'var(--fl-color-stroke-muted)'
                }}
            />
            <ColorItem
                title={t('pages.tokens.colors.other')}
                subtitle='--fl-color-*'
                colors={{
                    set: 'var(--fl-color-set)',
                    folder: 'var(--fl-color-folder)',
                    success: 'var(--fl-color-success)',
                    'success-hover': 'var(--fl-color-success-hover)',
                    error: 'var(--fl-color-error)',
                    'error-hover': 'var(--fl-color-error-hover)',
                    'error-desaturated': 'var(--fl-color-error-desaturated)',
                    warning: 'var(--fl-color-warning)',
                    'warning-hover': 'var(--fl-color-warning-hover)',
                    like: 'var(--fl-color-like)',
                    'like-hover': 'var(--fl-color-like-hover)',
                    knob: 'var(--fl-color-knob)',
                    'knob-active': 'var(--fl-color-knob-active)',
                    shadow: 'var(--fl-color-shadow)',
                    'shadow-strong': 'var(--fl-color-shadow-strong)',
                    backdrop: 'var(--fl-color-backdrop)',
                    'skeleton-highlight': 'var(--fl-color-skeleton-highlight)'
                }}
            />
        </ColorPalette>
    );
}

/** A sample of every text style. */
export function Typeset(): React.JSX.Element {
    useLocale();
    return (
        <div className='fl-docs-typeset'>
            {[
                'display-1',
                'display-2',
                'title-1',
                'title-2',
                'title-3',
                'heading-1',
                'heading-2',
                'heading-3',
                'body-plus',
                'body',
                'body-minus',
                'label'
            ].map((style) => (
                <div key={style} className='fl-docs-typeset-row'>
                    <code className='fl-docs-code'>{`fl-text-${style}-default`}</code>
                    <span className={`fl-text-${style}-default`}>{t('pages.tokens.typography.sample')}</span>
                </div>
            ))}
        </div>
    );
}
