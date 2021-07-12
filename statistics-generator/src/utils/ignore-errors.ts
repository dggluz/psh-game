import { _Promise } from 'error-typed-promise';

export const ignoreErrors = <EI extends new (...args: any[]) => any> (errorsToIgnore: EI[]) =>
    <E> (err: E) =>
        _Promise.reject(err as Exclude<E, InstanceType<EI>>)
;
