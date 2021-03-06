import { _Promise } from 'error-typed-promise';
import { Connection, createConnection, FieldInfo } from 'mysql';
import { getSecrets } from '../utils/get-secret';
import { makeLit } from '../utils/make-lit';

export class MysqlError extends Error {
    __brand = makeLit('MysqlError');

    constructor (e: unknown) {
        super(`${e}`);
    }
}

const forceConnect = () =>
    getSecrets({
        host: 'db_host',
        user: 'db_user',
        password: 'db_password',
        database: 'db_database'
    })
    .then(secrets =>
        new _Promise<Connection, MysqlError>((resolve, reject) => {
            const connection = createConnection(secrets);
            connection.connect(err => {
                if (err) {
                    reject(new MysqlError(err));
                }
                else {
                    resolve(connection);
                }
            });
        })
    )
;

let cnx: ReturnType<typeof forceConnect> | undefined;

export const connect = () => {
    if (!cnx) {
        cnx = forceConnect();
    }
    return cnx;
};

const getConnection = connect;

export const query = (sqlQuery: string, values: unknown[] = []) => {
    return getConnection()
        .then(cnx =>
            new _Promise<{results: unknown, fields: FieldInfo[] | undefined}, MysqlError>((resolve, reject) => {
                cnx.query(sqlQuery, values, (err, results, fields) => {
                    if (err) {
                        reject(new MysqlError(err));
                    }
                    else {
                        resolve({
                            results,
                            fields
                        });
                    }
                });
            })
        )
};

export const endConnection = () => {
    return getConnection()
        .then(cnx =>
            new _Promise<void, MysqlError>((resolve, reject) => {
                cnx.end(err => {
                    if (err) {
                        reject(new MysqlError(err));
                    }
                    else {
                        resolve(undefined);
                    }
                })
            })
        )
};
