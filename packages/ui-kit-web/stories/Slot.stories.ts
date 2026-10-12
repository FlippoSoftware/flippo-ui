import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample } from './helpers';
import { icon } from './kit';

type Props = Record<string, never>;

const markup = `<demo-slot as-child><a href="#slot">${icon('arrow-outward')}Ссылка внутри Slot</a></demo-slot>`;

const meta: Meta<Props> = {
    title: 'Utilities/Slot',
    args: {},
    argTypes: {},
    render: () => renderExample(markup, {}),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Slot не добавляет ни стилей, ни поведения: с `as-child` он не рисует своей коробки и оставляет единственный дочерний элемент как есть. Это точка расширения для композиции; части компонентов переносят свои стили и поведение на нативный элемент тем же `as-child`.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};
