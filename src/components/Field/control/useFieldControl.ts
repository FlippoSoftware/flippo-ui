import { useFieldControlContext } from './FieldControlContext';

export function useFieldControl() {
    const { controlProps: _, ...controlState } = useFieldControlContext();

    return controlState;
}
