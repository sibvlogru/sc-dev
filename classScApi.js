import https from 'https';

class classScApi {
    constructor(port = 2999) {
        this.port = port;
    }

    async postData(data) {
        const options = {
            hostname: 'localhost',
            port: this.port,
            path: '/api/v1/sc',
            method: 'POST',
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let response = '';

                res.on('data', chunk => {
                    response += chunk;
                });

                res.on('end', () => {
                    resolve(response);
                });
            });

            req.on('error', error => {
                reject(error);
            });

            req.write(JSON.stringify(data));
            req.end();
        });
    }

}

export { classScApi };