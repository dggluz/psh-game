import { _Promise } from 'error-typed-promise';
import { unknownError } from 'error-typed-promise/dist/typings/unknown-error';

type MergePromises<P extends _Promise<any, any>> = _Promise<
    P extends _Promise<infer T, any> ? T : unknown, P extends _Promise<any, infer E> ? E : unknownError
>;

export const mergePromises = <P extends _Promise<any, any>>(x: P) =>
    x as MergePromises<P>
;

export const mergePromisesFn = <F extends (...args: any[]) => _Promise<any, any>>(fn: F) =>
    fn as (...args: Parameters<F>) => MergePromises<ReturnType<F>>
;
