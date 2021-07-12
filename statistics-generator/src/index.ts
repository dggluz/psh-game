import { Record, Number, Array } from 'runtypes';
import { endConnection, query } from './db/db';
import { getRandomUsers } from './random-user';
import { randomInt } from './utils/random';

getRandomUsers(randomInt(0, 10))
  .then(({results}) => results.map((user): [string, string] => [
    user.login.username,
    user.picture.thumbnail
  ]))
  .then(usersData =>
    query('INSERT IGNORE INTO players (nickname, profile_image) VALUES ? ' +
      // Avoid inserting and already existing player
      'ON DUPLICATE KEY UPDATE player_id = player_id;',
      // Bulk insert needs an array OF an array (rows) with another array (values) inside
      [usersData])
      .then(_ => usersData)
  )
  .then(usersData =>
    query('SELECT player_id FROM players WHERE nickname IN (?);', [usersData.map(user => user[0])])
  )
  .then(({ results }) =>
    Array(
      Record({
        player_id: Number
      })
    ).check(results)
  )
  .then(playerIds =>
    query('INSERT INTO games (player_id, creation_date, score) VALUES ?;', [
      playerIds.map(({ player_id }) => [
        player_id,
        new Date(),
        randomInt(0, 100)
      ])
    ])
  )
  .then(console.log, console.error)
  .finally(endConnection)
;
