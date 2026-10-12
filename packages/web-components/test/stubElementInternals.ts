/**
 * What a stubbed `ElementInternals` received.
 */
export type FakeInternals = {
    formValue: string | FormData | null;
    valid: boolean;
    validationMessage: string;
    setFormValue(value: string | FormData | null): void;
    setValidity(flags: Partial<ValidityState>, message?: string): void;
};

/**
 * happy-dom has no `attachInternals`: stubs it to see what form-associated elements submit and report. Install it
 * before the elements are defined.
 *
 * @returns The internals of an element (if it attached them), and a function that removes the stub.
 */
export function stubElementInternals() {
    const prototype = HTMLElement.prototype as Partial<Pick<HTMLElement, 'attachInternals'>>;
    const all = new WeakMap<HTMLElement, FakeInternals>();
    prototype.attachInternals = function (this: HTMLElement) {
        const internals: FakeInternals = {
            formValue: null,
            valid: true,
            validationMessage: '',
            setFormValue(value) {
                this.formValue = value;
            },
            setValidity(flags, message = '') {
                this.valid = !Object.values(flags).some(Boolean);
                this.validationMessage = message;
            }
        };
        all.set(this, internals);
        return internals as unknown as ElementInternals;
    };
    return {
        internalsOf: (element: Element) => all.get(element as HTMLElement),
        restore: () => {
            // biome-ignore lint/performance/noDelete: the stub must not stay on the shared prototype.
            delete prototype.attachInternals;
        }
    };
}

/**
 * The entries of a submitted form value.
 */
export function formEntries(value: string | FormData | null | undefined): [string, string][] {
    return value instanceof FormData ? ([...value.entries()] as [string, string][]) : [];
}
