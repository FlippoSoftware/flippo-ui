import React from 'react';

import { Field as FieldHeadless } from '@flippo-ui/headless-components/field';

import { FieldControlSlot } from '../control-slot/FieldControlSlot';

export function FieldControl(props: FieldControl.Props) {
    return (
        <FieldHeadless.Control
          {...props}
            control={'input'}
        />
    );
}

FieldControl.Slot = FieldControlSlot;
FieldControl.useFieldControl = FieldHeadless.Control.useFieldControl;

export namespace FieldControl {
    export type Props = Omit<FieldHeadless.Control.InputProps, 'control'>;
}
