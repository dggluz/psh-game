import { _Promise } from 'error-typed-promise';
import { unknownError } from 'error-typed-promise/dist/typings/unknown-error';

export const assertUnknownError = (err: unknownError) =>
    _Promise.reject(err)
;
