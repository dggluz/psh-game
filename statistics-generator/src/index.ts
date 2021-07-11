import { query } from './db/db';

query('SELECT 1 + 1 AS solution').then(console.log, console.error);
