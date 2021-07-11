import { endConnection, query } from './db/db';
import { getRandomUsers } from './random-user';
import { randomInt } from './utils/random';

getRandomUsers(randomInt(0, 10))
  .then(({results}) => results.map((user): [string, string] => [
    user.login.username,
    user.picture.thumbnail
  ]))
  .then(usersData =>
    // Bulk insert needs an array OF an array (rows) with another array (values) inside
    query('INSERT INTO players (nickname, profile_image) VALUES ?;', [usersData])
  )
  .then(console.log, console.error)
  .finally(endConnection)
;
