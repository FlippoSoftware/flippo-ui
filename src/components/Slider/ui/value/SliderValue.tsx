import React from 'react';

import { Slider as SliderHeadless } from '@flippo-ui/headless-components/slider';

export function SliderValue(props: SliderValue.Props) {
    return <SliderHeadless.Value {...props} />;
}

export namespace SliderValue {
    export type Props = SliderHeadless.Value.Props;
}
