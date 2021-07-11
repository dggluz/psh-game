import { _Promise } from 'error-typed-promise';
import { unknownError } from 'error-typed-promise/dist/typings/unknown-error';
import { Connection, createConnection, FieldInfo, MysqlError, escape } from 'mysql';

let cnx: _Promise<Connection, MysqlError | unknownError> | undefined;

export const connect = () => {
    if (!cnx) {
        cnx = new _Promise<Connection, MysqlError>((resolve, reject) => {
            const connection = createConnection({
                host: 'db',
                user: 'user',
                password: 'password',
                database: 'psh'
            });
            connection.connect(err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(connection);
                }
            });
        });
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
                        reject(err);
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
                        reject(err);
                    }
                    else {
                        resolve(undefined);
                    }
                })
            })
        )
};
