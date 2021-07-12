import { _Promise } from 'error-typed-promise';
import { readFile } from 'fs';
import { makeLit } from './make-lit';

export const readStringFile = (path: string) => new _Promise<string, FileReadError>((resolve, reject) => {
    readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            reject(new FileReadError(err));
        }
        else {
            resolve(data);
        }
    });
});

export class FileReadError extends Error {
    __brand = makeLit('FileReadError');

    constructor(e: unknown) {
        super(`${e}`);
    }
}
