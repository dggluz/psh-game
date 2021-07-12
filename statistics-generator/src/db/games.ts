import { Record, Number } from 'runtypes';
import { query } from './db';
import { randomInt } from '../utils/random';

// Insert games into DB
export const insertGamesForPlayers = (playerIds: { player_id: number; }[]) =>
  query('INSERT INTO games (player_id, creation_date, score) VALUES ?;', [
    playerIds.map(({ player_id }) => [
      player_id,
      new Date(),
      randomInt(0, 100)
    ])
  ])
    .then(({ results }) =>
      Record({
        affectedRows: Number
      }).check(results)
    )
;
