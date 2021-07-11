import { _Promise } from 'error-typed-promise';
import { Runtype } from 'runtypes';

export class InvalidStructureError extends Error {
    tag = Symbol('InvalidStructureError');

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
