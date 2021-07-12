import { _Promise } from 'error-typed-promise';
import { getRandomUsers } from './random-user';
import { makeLit } from './utils/make-lit';
import { randomInt } from './utils/random';

export class ZeroPlayersError extends Error {
    __brand = makeLit('ZeroPlayersError');

    constructor() {
        super('No players for adding games');
    }
}

// GET 0 - 10 random players from randomuser.me
export const generatePlayers = () =>
    getRandomUsers(randomInt(0, 10))
        .then(({ results }) =>
            results.length ?
                _Promise.resolve(results) :
                _Promise.reject(new ZeroPlayersError())
        )
        .then(users => users.map((user): [string, string] => [
            user.login.username,
            user.picture.thumbnail
        ]))
;
