import type * as React from 'react';

import { snippet as recipe } from '@flippo-software/component-styles/snippet';

import type { Meta, StoryObj } from '@storybook/react';

import { Snippet } from '~@src';
import { Page, Section, variantControls } from '~@stories';

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
                <Snippet.CopyButton aria-label='Скопировать команду' />
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
                component:
                    'Блок команд: строки с символом приглашения и кнопка копирования в углу. Символ не копируется и не выделяется; после копирования кнопка на секунду зеленеет.'
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
            <Section title='Несколько строк' description='Каждая строка — `Snippet.Line`; копируется весь текст без символов.'>
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
                        <Snippet.CopyButton aria-label='Скопировать команды' />
                    </Snippet.Root>
                </div>
            </Section>
            <Section title='Свой символ' description='`symbol` на корне: например «>» для REPL.'>
                <div className='sb-medium'>
                    <Snippet.Root symbol='>'>
                        <Snippet.Line>
                            <Snippet.Symbol />
                            {"flippo.study('ux-laws-exam')"}
                        </Snippet.Line>
                        <Snippet.CopyButton aria-label='Скопировать' />
                    </Snippet.Root>
                </div>
            </Section>
        </Page>
    )
};
