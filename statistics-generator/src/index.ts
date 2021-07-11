import { endConnection, query } from './db/db';
import { getRandomUsers } from './random-user';

const random = (min: number, max: number): number => {
  if (min === max) {
    return min;
  }

  if (max < min) {
    return random(max, min);
  }

  return min + Math.random() * (max - min);
};

const randomInt = (min: number, max: number) =>
  Math.round(random(min, max))
;

const randomNumber = randomInt(0, 10);

getRandomUsers(randomNumber)
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
