import { _Promise } from 'error-typed-promise';
import { caseError } from './case-error';
import { isInstanceOf } from './is-instance-of';
import { makeLit } from './make-lit';
import { mergePromisesFn } from './merge-promises';
import { readStringFile, FileReadError } from './read-string-file';

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

export const getSecrets = <T extends Record<string, string>> (secrets: T) =>
    _Promise.all(Object
        .entries(secrets)
        .map(([key, secretName]) =>
            getSecret(secretName)
                .then((secret) => [key, secret])
        ))
        .then(entries => Object.fromEntries(entries) as {[K in keyof T]: string});
;

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
