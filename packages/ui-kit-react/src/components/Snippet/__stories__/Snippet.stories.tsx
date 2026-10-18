import type * as React from 'react';

import { snippet as recipe } from '@flippo-software/component-styles/snippet';

import type { Meta, StoryObj } from '@storybook/react';

import { Snippet } from '~@src';
import { Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-medium'>
            <Snippet.Root {...args}>
                <Snippet.Line>
                    <Snippet.Symbol />
                    pnpm add @flippo-software/ui-kit-react
                </Snippet.Line>
                <Snippet.CopyButton aria-label={t('snippet.labels.copyTheCommand')} />
            </Snippet.Root>
        </div>
    );
}

const meta = {
    title: 'Display/Snippet',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'snippet.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('snippet.sections.severalLines.title')} description={t('snippet.sections.severalLines.description')}>
                <div className='sb-medium'>
                    <Snippet.Root>
                        <Snippet.Line>
                            <Snippet.Symbol />
                            pnpm add @flippo-software/ui-kit-react
                        </Snippet.Line>
                        <Snippet.Line>
                            <Snippet.Symbol />
                            pnpm add @flippo-software/component-styles
                        </Snippet.Line>
                        <Snippet.CopyButton aria-label={t('snippet.labels.copyTheCommands')} />
                    </Snippet.Root>
                </div>
            </Section>
            <Section title={t('snippet.sections.customSymbol.title')} description={t('snippet.sections.customSymbol.description')}>
                <div className='sb-medium'>
                    <Snippet.Root symbol='>'>
                        <Snippet.Line>
                            <Snippet.Symbol />
                            {"flippo.study('ux-laws-exam')"}
                        </Snippet.Line>
                        <Snippet.CopyButton aria-label={t('snippet.labels.copy')} />
                    </Snippet.Root>
                </div>
            </Section>
        </Page>
    )
};
