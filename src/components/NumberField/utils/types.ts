export type Direction = -1 | 1;

export type DirectionalChangeReason
    = | 'increment-press'
      | 'decrement-press'
      | 'wheel'
      | 'scrub'
      | 'keyboard';

export type ChangeEventCustomProperties = {
    direction?: Direction;
};

export type IncrementValueParameters = {
    direction: Direction;
    event?: Event | React.SyntheticEvent;
    reason: DirectionalChangeReason;
    currentValue?: number | null;
};

export type EventWithOptionalKeyState = {
    altKey?: boolean;
    shiftKey?: boolean;
};
