import { Array, Number, Record } from 'runtypes';
import { query } from './db';

// Insert players on DB
export const upsertPlayers = (usersData: [string, string][]) =>
    query('INSERT IGNORE INTO players (nickname, profile_image) VALUES ? ' +
        // Avoid inserting and already existing player
        'ON DUPLICATE KEY UPDATE player_id = player_id;',
        // Bulk insert needs an array OF an array (rows) with another array (values) inside
        [usersData])
        .then(_ => usersData)
;

// Get players' IDs
export const getPlayersIds = (usersData: [string, unknown][]) =>
    query(
        'SELECT player_id FROM players WHERE nickname IN (?);',
        [usersData.map(user => user[0])])
        .then(({ results }) =>
            Array(
                Record({
                    player_id: Number
                })
            ).check(results)
        )
;
