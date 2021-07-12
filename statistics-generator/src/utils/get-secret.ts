import { _Promise } from 'error-typed-promise';
import { unknownError } from 'error-typed-promise/dist/typings/unknown-error';
import { readFile } from 'fs';

const readStringFile = (path: string) =>
    new _Promise<string, FileReadError>((resolve, reject) => {
        readFile(path, {encoding: 'utf-8'}, (err, data) => {
            if (err) {
                reject(new FileReadError(err));
            }
            else {
                resolve(data);
            }
        })
    })
;

export class FileReadError extends Error {
    tag = Symbol('FileReadError');

    constructor (e: unknown) {
        super(`${ e }`);
    }
}

const caseError = <ExpectedError, ResolvedResult, RejectedResult> (
        errPredicate: <E> (err: E | ExpectedError) => err is ExpectedError,
        errHandler: (err: ExpectedError) => _Promise<ResolvedResult, RejectedResult>
    ) => <CurrentError> (err: CurrentError) => {
        if (errPredicate(err)) {
            return errHandler(err);
        }
        return _Promise.reject(err as Exclude<CurrentError, ExpectedError>);
    }
;

const isInstanceOf = <I> (expectedConstructor: new (...args: any[]) => I) =>
    (target: unknown): target is I =>
        target instanceof expectedConstructor
;

type MergePromises<P extends _Promise<any, any>> = _Promise<
    P extends _Promise<infer T, any> ? T : unknown,
    P extends _Promise<any, infer E> ? E : unknownError
>;

const mergePromises = <P extends _Promise<any, any>> (x: P) =>
    x as MergePromises <P>
;

const mergePromisesFn = <F extends (...args: any[]) => _Promise<any, any>> (fn: F) =>
    fn as (...args: Parameters<F>) => MergePromises<ReturnType<F>>
;

export const getSecret = mergePromisesFn((secretName: string) => {
    if (secretName.includes('.')) {
        return _Promise.reject(new InvalidSecretNameError(secretName));
    }

    return readStringFile(`/run/secrets/${secretName}`)
        .then(x => x, err => _Promise.reject(err))
        .catch(caseError(
            isInstanceOf(FileReadError),
            err => _Promise.reject(new InexistentSecretError(secretName))
        ))
        .then(x => x, err => _Promise.reject(err))
    ;
});

const makeLit = <T extends string> (x: T) => x;

export class InvalidSecretNameError extends Error {
    __brand = makeLit('InvalidSecretNameError')

    constructor (secretName: string) {
        super(`The secret name ("${secretName}") is not valid`);
    }
}

export class InexistentSecretError extends Error {
    __brand = makeLit('InexistentSecretError')

    constructor (secretName: string) {
        super(`The secret name ("${secretName}") does not exist`);
    }
}
