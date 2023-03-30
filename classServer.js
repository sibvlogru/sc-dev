import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
// import { classScApi } from './classScApi.js'

class classServer {
    constructor(port) {
        this.port = port;
        this.name = 'server';
        this.color = 'blue';
        this.app = new Koa();
        this.router = new Router();
        this.log = console.log;

        // Middleware
        this.app.use(cors());
        this.app.use(bodyParser());

        this.router.post('/api/v1/sc', async ctx => {
            this.log('Recieve:', ctx.request.body);
            await this.delay(5000);
            ctx.status = 200;
            ctx.body = { status: 200, message: 'Image stored in ./storage' };
        });

        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());

        // Start server
        this.server = null;

    }

    async start() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, (error) => {
                if (error) {
                    reject(error);
                } else {
                    this.log(`Server is listening on port ${this.port}`);
                    resolve();
                }
            });
        });
    }

    stop() {
        this.server.close();
    }

    async delay(ms) {
        return (
            new Promise(function (resolve, reject) {
                setTimeout(function () { resolve(); }, ms);
            })
        );
    }
}

export { classServer };
