import { _Promise } from 'error-typed-promise';
import { endConnection, MysqlError } from './db/db';
import { getPlayersIds, upsertPlayers } from './db/players';
import { insertGamesForPlayers } from './db/games';
import { getRandomUsers } from './random-user';
import { assertUnknownError } from './utils/assert-unknown-error';
import { caseError } from './utils/case-error';
import { InvalidStructureError } from './utils/check-structure';
import { RequestError } from './utils/get-req';
import { InexistentSecretError, InvalidSecretNameError } from './utils/get-secret';
import { ignoreErrors } from './utils/ignore-errors';
import { isInstanceOf } from './utils/is-instance-of';
import { makeLit } from './utils/make-lit';
import { JsonParseError } from './utils/parse-json';
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

  // Insert players and games on the DB
  .then(upsertPlayers)
  .then(getPlayersIds)
  .then(insertGamesForPlayers)

  // Log results
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

  // Ensure no error has been forgotten
  .catch(err => _Promise.reject(err))
  .catch(ignoreErrors([InvalidStructureError, InvalidSecretNameError, InexistentSecretError, RequestError, MysqlError, JsonParseError]))
  .catch(err => assertUnknownError(err))

  // Close connection
  .catch(console.error)
  .finally(endConnection)
;
