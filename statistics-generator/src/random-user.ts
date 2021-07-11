import { _Promise } from 'error-typed-promise';
import { Array, Record, String } from 'runtypes';
import { checkStructure } from './utils/check-structure';
import { getReq } from './utils/get-req';
import { parseJson } from './utils/parse-json';

export const getRandomUsers = (qty: number) => {
    const url = `https://randomuser.me/api/?results=${qty}`;

    return getReq(url)
        .then(parseJson)
        .then(checkStructure(Record({
            results: Array(Record({
                login: Record({
                    username: String
                }),
                picture: Record({
                    large: String,
                    medium: String,
                    thumbnail: String
                })
            }))
        })))
    ;
};
