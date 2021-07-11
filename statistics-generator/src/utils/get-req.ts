import { _Promise } from 'error-typed-promise';
import { get } from 'https';

export const getReq = (url: string) => {
        return new _Promise<string, RequestError>((resolve, reject) => {
            get(url, res => {
                const { statusCode } = res;
                if (!statusCode || statusCode >= 300 || statusCode < 200) {
                    reject(new RequestError(`Unexpected status code ${statusCode}`));
                    return;
                }

                let result = '';

                res.on('data', (data) => {
                    result = result + data;
                });

                res.on('error', e => reject(new RequestError(e)));

                res.on('end', () => resolve(result));
            });
        });
    }
;

export class RequestError extends Error {
    tag = Symbol('RequestError');

    constructor (e: unknown) {
        super(`${ e }`);
    }
}
