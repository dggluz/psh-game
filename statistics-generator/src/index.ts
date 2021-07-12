import { _Promise } from 'error-typed-promise';
import { Record, Number, Array } from 'runtypes';
import { endConnection, query } from './db/db';
import { getRandomUsers } from './random-user';
import { caseError } from './utils/case-error';
import { isInstanceOf } from './utils/is-instance-of';
import { makeLit } from './utils/make-lit';
import { randomInt } from './utils/random';

class ZeroPlayersError extends Error {
  __brand = makeLit('ZeroPlayersError');

  constructor () {
    super('No players for adding games');
  }
}

// GET 0 - 10 random players from randomuser.me
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
  // Insert players on DB
  .then(usersData =>
    query('INSERT IGNORE INTO players (nickname, profile_image) VALUES ? ' +
      // Avoid inserting and already existing player
      'ON DUPLICATE KEY UPDATE player_id = player_id;',
      // Bulk insert needs an array OF an array (rows) with another array (values) inside
      [usersData])
      .then(_ => usersData)
  )
  // Get players' IDs
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
  // Insert games into DB
  .then(playerIds =>
    query('INSERT INTO games (player_id, creation_date, score) VALUES ?;', [
      playerIds.map(({ player_id }) => [
        player_id,
        new Date(),
        randomInt(0, 100)
      ])
    ])
  )
  .then(({ results }) =>
    Record({
      affectedRows: Number
    }).check(results)
  )
  .then(({ affectedRows }) =>
    console.log(`Added ${ affectedRows} games to DB.`)
  )
  .catch(caseError(
    isInstanceOf(ZeroPlayersError),
    err => {
      console.log('None game was added to DB.');
      return _Promise.resolve(null)
    }
  ))
  .catch(console.error)
  .finally(endConnection)
;
