import type * as React from 'react';

import { button } from '@flippo-software/component-styles/button';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Slot } from '~@src';
import { t } from '~@stories';

type Props = Record<string, never>;

function Example(): React.JSX.Element {
    return (
        <div className='story-example'>
            <Slot className={button({ variant: 'secondary' })}>
                <a href='#slot'>{t('slot.content.aLinkWithThe')}</a>
            </Slot>
        </div>
    );
}

const meta = {
    title: 'Utilities/Slot',
    component: Example,
    args: {},
    argTypes: {},
    parameters: {
        docs: {
            description: {
                component: 'slot.description'
            }
        }
    }
} satisfies Meta<Props>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RenderProp: Story = {
    render: () => (
        <div className='story-example'>
            <Button render={<a href='#render' />} variant='label'>
                <Icon name='arrow-outward' />

                {t('slot.content.aButtonAsA')}
            </Button>
        </div>
    )
};
