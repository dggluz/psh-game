export const isInstanceOf = <I>(expectedConstructor: new (...args: any[]) => I) =>
    (target: unknown): target is I =>
        target instanceof expectedConstructor
;
