import { _Promise } from 'error-typed-promise';
import { resolve } from 'path';
import { createServer, Next, Request, Response } from 'restify';
import { Array, Number, Record, String } from 'runtypes';
import { query } from './db/db';
import { readStringFile } from './utils/read-string-file';

const tapCatch = <E> (fn: (e: E) => any) =>
  (err: E) => {
    fn(err);
    return _Promise.reject(err)
  }
;

const getRanking = (req: Request, res: Response, next: Next) => {
  console.log('Getting ranking')
  readStringFile(resolve(__dirname, './get-ranking.sql'))
    .then(sql =>
      query(sql)
    )
    .then(( { results }) =>
      Array(Record({
        nickname: String,
        score: Number
      })).check(results)
    )
    // TODO: add last update
    .then(ranking => {
      res.json(ranking);
    })
    .catch(e => _Promise.reject(e))
    .catch(tapCatch(e => res.send(500, 'Internal server error')))
    .catch(e => _Promise.reject(e))
    .catch(console.error)
    .finally(() => next())
  ;
};

const ping = (req: Request, res: Response, next: Next) => {
  console.log('Ping');

  res.send('pong');
}

var server = createServer();
server.get('/ranking', getRanking);
server.get('/ping', ping);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
