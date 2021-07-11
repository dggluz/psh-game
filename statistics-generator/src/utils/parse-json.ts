import { _Promise } from 'error-typed-promise';

export const parseJson = (x: string) =>
    new _Promise<unknown, SyntaxError>((resolve, reject) => {
        try {
            resolve(JSON.parse(x));
        }
        catch (e) {
            reject(e);
        }
    })
;
