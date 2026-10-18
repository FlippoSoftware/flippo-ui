import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, renderExample, t } from '~@stories';

type Props = Record<string, never>;

const markup = () => `<demo-slot as-child><a href="#slot">${icon('arrow-outward')}${t('slot.content.aLinkInsideSlot')}</a></demo-slot>`;

const meta: Meta<Props> = {
    title: 'Utilities/Slot',
    args: {},
    argTypes: {},
    render: () => renderExample(markup(), {}),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'slot.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};
