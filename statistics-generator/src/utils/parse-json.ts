import { _Promise } from 'error-typed-promise';
import { makeLit } from './make-lit';

export class JsonParseError extends SyntaxError {
    __brand = makeLit('JsonParseError');
}

export const parseJson = (x: string) =>
    new _Promise<unknown, JsonParseError>((resolve, reject) => {
        try {
            resolve(JSON.parse(x));
        }
        catch (e) {
            reject(new JsonParseError(e));
        }
    })
;
