export enum MultipleActiveAttributes {
    multipleActive = 'data-multiple-active'
}

export function multipleActive(value: boolean) {
    if (value) {
        return {
            [MultipleActiveAttributes.multipleActive]: ''
        };
    }

    return null;
}
