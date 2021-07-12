import { _Promise } from 'error-typed-promise';
import { Runtype } from 'runtypes';
import { makeLit } from './make-lit';

export class InvalidStructureError extends Error {
    __brand = makeLit('InvalidStructureError');

    constructor (e: unknown) {
        super(`${ e }`);
    }
}

export const checkStructure = <T> (check: Runtype<T>) => (x: unknown) =>
    new _Promise<T, InvalidStructureError>((resolve, reject) => {
        try {
            resolve(check.check(x));
        }
        catch (e) {
            reject(new InvalidStructureError(e));
        }
    })
;
