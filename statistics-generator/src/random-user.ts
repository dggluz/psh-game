import { get } from 'https';
import { _Promise } from 'error-typed-promise';
import { Array, Record, Runtype, String } from 'runtypes';

const getReq = (url: string) =>
    new _Promise<string, RequestError>((resolve, reject) => {
        get(url, res => {
            const { statusCode } = res;
            if (!statusCode || statusCode >= 300 || statusCode < 200) {
                reject(new RequestError(`Unexpected status code ${ statusCode }`));
                return;
            }
            
            let result = '';

            res.on('data', (data) => {
              result = result + data;
            });

            res.on('error', e => reject(new RequestError(e)));

            res.on('end', () => resolve(result));
        });
    })
;

class RequestError extends Error {
    tag = Symbol('RequestError');

    constructor (e: unknown) {
        super(`${ e }`);
    }
}

class InvalidStructureError extends Error {
    tag = Symbol('InvalidStructureError');

    constructor (e: unknown) {
        super(`${ e }`);
    }
}

const parseJson = (x: string) =>
    new _Promise<unknown, SyntaxError>((resolve, reject) => {
        try {
            resolve(JSON.parse(x));
        }
        catch (e) {
            reject(e);
        }
    })
;

const checkStructure = <T> (check: Runtype<T>) => (x: unknown) =>
    new _Promise<T, InvalidStructureError>((resolve, reject) => {
        try {
            resolve(check.check(x));
        }
        catch (e) {
            reject(new InvalidStructureError(e));
        }
    })
;

export const getRandomUsers = (qty: number) => {
    const url = `https://randomuser.me/api/?results=${qty}`;

    return getReq(url)
        .then(x => x)
        .then(parseJson)
        .then(checkStructure(Record({
            results: Array(Record({
                name: Record({
                    title: String,
                    first: String,
                    last: String
                }),
                picture: Record({
                    large: String,
                    medium: String,
                    thumbnail: String
                })
            }))
        })))
        .then(x => x, err => _Promise.reject(err))
        .then(console.log, console.error)
    ;
};
