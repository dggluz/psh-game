import { get } from 'https';

const getP = (url: string) =>
    new Promise((resolve, reject) => {
        get(url, res => {
            const { statusCode } = res;
            if (!statusCode || statusCode >= 300 || statusCode < 200) {
                reject(new Error(`Unexpected status code ${ statusCode }`));
                return;
            }
            
            let result = '';

            res.on('data', (data) => {
              result = result + data;
            });

            res.on('error', reject);

            res.on('end', () => resolve(result));
        });
    })
;

getP('https://randomuser.me/api').then(console.log, console.error);
