import { createServer, Next, Request, Response } from 'restify';
import { connect, query } from './db/db';

function respond(req: Request, res: Response, next: Next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

query('SELECT 1 + 1 AS solution').then(console.log, console.error);
