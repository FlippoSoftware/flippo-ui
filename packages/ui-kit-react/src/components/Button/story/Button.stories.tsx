import React from 'react';

import { PlusIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { StoryCombine } from '../..//StoryCombine';
import { Button } from '../ui/Button';

const ARGS: Partial<Button.Props> = {
    children: 'Button'
};

const meta: Meta = {
    args: { ...ARGS, size: 'large' },
    argTypes: {
        children: { control: 'object', name: 'React.ReactNode' },
        disabled: { control: 'boolean' },
        size: { control: 'select', options: [
            'x-small',
            'small',
            'medium',
            'large'
        ] },
        variant: { control: 'select', options: [
            'danger',
            'label',
            'outlined',
            'secondary',
            'primary'
        ] }
    },
    component: Button,
    title: 'Input/Button'
};

export default meta;

type ButtonStory = StoryObj<typeof Button>;

export const PrimaryButton: ButtonStory = {
    args: {
        variant: 'primary'
    }
};

export const SecondaryButton: ButtonStory = {
    args: {
        variant: 'secondary'
    }
};

export const OutlinedButton: ButtonStory = {
    args: {
        variant: 'outlined'
    }
};

export const LabelButton: ButtonStory = {
    args: {
        variant: 'label'
    }
};

export const DangerButton: ButtonStory = {
    args: {
        variant: 'danger'
    }
};

export const ButtonAsLink: ButtonStory = {
    args: {
        variant: 'primary',
        link: true
    }
};

export const ButtonLoading: ButtonStory = {
    args: {
        variant: 'primary',
        loading: true
    }
};

type TVariant = Omit<StoryCombine.Variant<Button.Props>, 'components'>;

const VARIANT_SECONDARY: TVariant = {
    name: 'Secondary',
    variantArgs: {
        variant: 'secondary'
    }
};

const VARIANT_OUTLINED: TVariant = {
    name: 'Outlined',
    variantArgs: {
        variant: 'outlined'
    }
};

const VARIANT_LABEL: TVariant = {
    name: 'Label',
    variantArgs: {
        variant: 'label'
    }
};

const VARIANT_PRIMARY: TVariant = {
    name: 'Primary',
    variantArgs: {
        variant: 'primary'
    }
};

const VARIANT_DANGER: TVariant = {
    name: 'Danger',
    variantArgs: {
        variant: 'danger'
    }
};

const CHILDREN = 'Button';
const CHILDREN_WITH_ICON = (
    <React.Fragment>
        {'Button'}
        <PlusIcon type={'default'} />
    </React.Fragment>
);

const COMPONENTS: Partial<Button.Props>[] = [
    { children: CHILDREN },
    { children: CHILDREN_WITH_ICON },
    { icon: true, children: <PlusIcon type={'default'} /> },
    { disabled: true, children: CHILDREN },
    { disabled: true, children: CHILDREN_WITH_ICON },
    { disabled: true, icon: true, children: <PlusIcon type={'default'} /> }
];

const VARIANTS = [
    {
        components: COMPONENTS,
        ...VARIANT_PRIMARY
    },
    {
        components: COMPONENTS,
        ...VARIANT_SECONDARY
    },
    {
        components: COMPONENTS,
        ...VARIANT_OUTLINED
    },
    {
        components: COMPONENTS,
        ...VARIANT_LABEL
    },
    {
        components: COMPONENTS,
        ...VARIANT_DANGER
    }
];

const GROUPS: StoryCombine.Props<Button.Props> = {
    args: ARGS,
    // @ts-expect-error reason : button have oveloaded props
    component: Button,
    groups: [
        {
            groupArgs: {
                size: 'large'
            },
            name: 'Large',
            variants: VARIANTS
        },
        {
            groupArgs: {
                size: 'medium'
            },
            name: 'Medium',
            variants: VARIANTS
        },
        {
            groupArgs: {
                size: 'small'
            },
            name: 'Small',
            variants: VARIANTS
        },
        {
            groupArgs: {
                size: 'x-small'
            },
            name: 'X-Small',
            variants: VARIANTS
        }
    ]
};

export const ButtonStoryCombine: ButtonStory = {
    render: () => <StoryCombine {...GROUPS} />
};
