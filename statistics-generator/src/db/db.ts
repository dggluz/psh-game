import { _Promise } from 'error-typed-promise';
import { unknownError } from 'error-typed-promise/dist/typings/unknown-error';
import { Connection, createConnection, FieldInfo, MysqlError } from 'mysql';
import { getSecret, InexistentSecretError, InvalidSecretNameError } from '../utils/get-secret';

let cnx: _Promise<Connection, MysqlError | unknownError | InvalidSecretNameError | InexistentSecretError> | undefined;

const getSecrets = <T extends Record<string, string>> (secrets: T) =>
    _Promise.all(Object
        .entries(secrets)
        .map(([key, secretName]) =>
            getSecret(secretName)
                .then((secret) => [key, secret])
        ))
        .then(entries => Object.fromEntries(entries) as {[K in keyof T]: string});
;

export const connect = () => {
    if (!cnx) {
        cnx = getSecrets({
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
                        reject(err);
                    }
                    else {
                        resolve(connection);
                    }
                });
            }))
        ;
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
